import React, { useState, useRef } from "react";
import { withAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout/Layout";
import {
	Upload,
	FileText,
	ArrowLeft,
	Loader2,
	CheckCircle,
	AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { esgAPI, handleApiError, handleApiSuccess } from "@/utils/api";
import toast from "react-hot-toast";

interface UploadResponse {
	success: boolean;
	message: string;
	data?: any;
}

const UploadPDFPage: React.FC = () => {
	const [file, setFile] = useState<File | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [uploadProgress, setUploadProgress] = useState(0);
	const [extractedText, setExtractedText] = useState<string>("");
	const [aiResponse, setAiResponse] = useState<any>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFile = event.target.files?.[0];
		if (selectedFile) {
			if (selectedFile.type === "application/pdf") {
				setFile(selectedFile);
				setExtractedText("");
				setAiResponse(null);
				toast.success("PDF file selected successfully!");
			} else {
				toast.error("Please select a valid PDF file");
				event.target.value = "";
			}
		}
	};

	const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
		const droppedFile = event.dataTransfer.files[0];
		if (droppedFile && droppedFile.type === "application/pdf") {
			setFile(droppedFile);
			setExtractedText("");
			setAiResponse(null);
			toast.success("PDF file dropped successfully!");
		} else {
			toast.error("Please drop a valid PDF file");
		}
	};

	const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
		event.preventDefault();
	};

	const extractTextFromPDF = async (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			
			reader.onload = async (event) => {
				try {
					const arrayBuffer = event.target?.result as ArrayBuffer;
					
					// Method 1: Try using PDF.js from CDN
					try {
						await extractWithPDFJS(arrayBuffer, resolve, reject);
					} catch (error) {
						console.log('PDF.js method failed, trying fallback...');
						// Method 2: Try binary text extraction
						try {
							await extractFromBinary(arrayBuffer, resolve, reject);
						} catch (error2) {
							console.log('Binary extraction failed, trying browser method...');
							// Method 3: Try browser PDF viewer
							try {
								await extractWithBrowser(arrayBuffer, resolve, reject);
							} catch (error3) {
								console.log('All methods failed');
								reject(new Error('No text could be extracted from this PDF. It might be a scanned document or image-based PDF.'));
							}
						}
					}
				} catch (error) {
					reject(error);
				}
			};
			
			reader.onerror = () => reject(new Error('Failed to read file'));
			reader.readAsArrayBuffer(file);
		});
	};

	const extractWithPDFJS = async (arrayBuffer: ArrayBuffer, resolve: (text: string) => void, reject: (error: Error) => void) => {
		return new Promise<void>((resolveMethod, rejectMethod) => {
			// Load PDF.js from CDN dynamically
			const script = document.createElement('script');
			script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
			
			script.onload = async () => {
				try {
					// @ts-ignore - PDF.js loaded from CDN
					const pdfjsLib = window.pdfjsLib;
					pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
					
					const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
					let fullText = '';
					
					for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
						const page = await pdf.getPage(pageNum);
						const textContent = await page.getTextContent();
						const pageText = textContent.items.map((item: any) => item.str).join(' ');
						fullText += pageText + '\n';
						
						// Update progress
						const progress = (pageNum / pdf.numPages) * 100;
						setUploadProgress(progress);
					}
					
					const cleanedText = fullText.replace(/\s+/g, ' ').replace(/\n+/g, ' ').trim();
					if (cleanedText.length > 0) {
						resolve(cleanedText);
						resolveMethod();
					} else {
						rejectMethod(new Error('No text extracted'));
					}
				} catch (pdfError) {
					console.error('PDF.js extraction failed:', pdfError);
					rejectMethod(new Error('PDF.js failed'));
				}
			};
			
			script.onerror = () => {
				rejectMethod(new Error('Failed to load PDF.js'));
			};
			
			document.head.appendChild(script);
		});
	};

	const extractFromBinary = async (arrayBuffer: ArrayBuffer, resolve: (text: string) => void, reject: (error: Error) => void) => {
		try {
			const uint8Array = new Uint8Array(arrayBuffer);
			const decoder = new TextDecoder('utf-8');
			const text = decoder.decode(uint8Array);
			
			// Extract text between common PDF text markers
			const textMatches = text.match(/\(([^)]+)\)/g);
			if (textMatches && textMatches.length > 0) {
				const extractedText = textMatches
					.map(match => match.replace(/[()]/g, ''))
					.filter(str => str.length > 3 && /[a-zA-Z]/.test(str))
					.join(' ');
				
				if (extractedText.trim().length > 0) {
					resolve(extractedText.trim());
					return;
				}
			}
			
			// Look for text in stream objects
			const streamMatches = text.match(/stream[\s\S]*?endstream/g);
			if (streamMatches && streamMatches.length > 0) {
				const extractedText = streamMatches
					.map(stream => {
						const content = stream.replace(/stream|endstream/g, '').trim();
						try {
							return decoder.decode(new Uint8Array(content.split('').map(c => c.charCodeAt(0))));
						} catch {
							return content;
						}
					})
					.filter(str => str.length > 0)
					.join(' ');
				
				if (extractedText.trim().length > 0) {
					resolve(extractedText.trim());
					return;
				}
			}
			
			reject(new Error('No text found in binary data'));
		} catch (error) {
			reject(new Error('Binary extraction failed'));
		}
	};

	const extractWithBrowser = async (arrayBuffer: ArrayBuffer, resolve: (text: string) => void, reject: (error: Error) => void) => {
		return new Promise<void>((resolveMethod, rejectMethod) => {
			try {
				const blob = new Blob([arrayBuffer], { type: 'application/pdf' });
				const url = URL.createObjectURL(blob);
				
				// Create an iframe to load the PDF
				const iframe = document.createElement('iframe');
				iframe.style.display = 'none';
				iframe.src = url;
				
				iframe.onload = () => {
					try {
						const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
						if (iframeDoc) {
							const pdfText = iframeDoc.body?.textContent || iframeDoc.documentElement?.textContent;
							if (pdfText && pdfText.trim().length > 0) {
								URL.revokeObjectURL(url);
								document.body.removeChild(iframe);
								resolve(pdfText.trim());
								resolveMethod();
								return;
							}
						}
					} catch (iframeError) {
						console.log('Iframe method failed:', iframeError);
					}
					
					// Clean up
					URL.revokeObjectURL(url);
					document.body.removeChild(iframe);
					rejectMethod(new Error('No text found in browser'));
				};
				
				iframe.onerror = () => {
					URL.revokeObjectURL(url);
					document.body.removeChild(iframe);
					rejectMethod(new Error('Failed to load PDF'));
				};
				
				document.body.appendChild(iframe);
				
				// Set timeout
				setTimeout(() => {
					try {
						URL.revokeObjectURL(url);
						if (document.body.contains(iframe)) {
							document.body.removeChild(iframe);
						}
					} catch {}
					rejectMethod(new Error('PDF loading timed out'));
				}, 10000);
				
			} catch (browserError) {
				rejectMethod(new Error('Browser method failed'));
			}
		});
	};

	const handleUpload = async () => {
		if (!file) {
			toast.error("Please select a PDF file first");
			return;
		}

		setIsUploading(true);
		setUploadProgress(0);

		try {
			// Extract text from PDF using multiple methods
			const extractedTextResult = await extractTextFromPDF(file);
			setExtractedText(extractedTextResult);
			
			toast.success("PDF processed successfully! Text extracted.");
			
			// Automatically send to AI endpoint
			await sendToAI(extractedTextResult);
			
		} catch (error) {
			console.error("Error processing PDF:", error);
			
			// Provide specific error messages based on error type
			let errorMessage = "Failed to process PDF file. Please try again.";
			
			if (error instanceof Error) {
				if (error.message.includes('No text could be extracted')) {
					errorMessage = "No text could be extracted from this PDF. It might be a scanned document or image-based PDF. Please try with a text-based PDF.";
				} else if (error.message.includes('Failed to read file')) {
					errorMessage = "Failed to read the PDF file. Please try again or use a different file.";
				}
			}
			
			toast.error(errorMessage);
		} finally {
			setIsUploading(false);
		}
	};

	const sendToAI = async (text: string) => {
		setIsProcessing(true);
		try {
			const response = await esgAPI.sendToAI({ text });
			setAiResponse(response.data);
			toast.success("AI analysis completed successfully!");
		} catch (error) {
			console.error("Error sending to AI:", error);
			handleApiError(error);
		} finally {
			setIsProcessing(false);
		}
	};

	const resetForm = () => {
		setFile(null);
		setExtractedText("");
		setAiResponse(null);
		setUploadProgress(0);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	return (
		<Layout title="Upload PDF - Oren ESG">
			<div className="min-h-screen bg-gray-50 py-8">
				<div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
					{/* Header */}
					<div className="mb-8">
						<Link
							href="/"
							className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-4"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Home
						</Link>
						<h1 className="text-3xl font-bold text-gray-900">Upload PDF for ESG Analysis</h1>
						<p className="mt-2 text-gray-600">
							Upload a PDF document to extract text and analyze it with our AI system.
						</p>
					</div>

					{/* Upload Area */}
					<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
						<div
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
								file
									? "border-green-300 bg-green-50"
									: "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
							}`}
						>
							{file ? (
								<div className="space-y-4">
									<CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
									<div>
										<h3 className="text-lg font-medium text-gray-900">
											{file.name}
										</h3>
										<p className="text-sm text-gray-500">
											{(file.size / 1024 / 1024).toFixed(2)} MB
										</p>
									</div>
								</div>
							) : (
								<div className="space-y-4">
									<Upload className="w-16 h-16 text-gray-400 mx-auto" />
									<div>
										<h3 className="text-lg font-medium text-gray-900">
											Drop your PDF here
										</h3>
										<p className="text-sm text-gray-500">
											or click to browse files
										</p>
									</div>
								</div>
							)}

							<input
								ref={fileInputRef}
								type="file"
								accept=".pdf"
								onChange={handleFileSelect}
								className="hidden"
							/>

							<button
								onClick={() => fileInputRef.current?.click()}
								className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
							>
								{file ? "Change File" : "Choose File"}
							</button>
						</div>

						{/* Upload Button */}
						{file && (
							<div className="mt-6 text-center">
								<button
									onClick={handleUpload}
									disabled={isUploading}
									className="bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-8 rounded-lg transition-colors disabled:cursor-not-allowed inline-flex items-center space-x-2"
								>
									{isUploading ? (
										<>
											<Loader2 className="w-5 h-5 animate-spin" />
											<span>Processing PDF...</span>
										</>
									) : (
										<>
											<Upload className="w-5 h-5" />
											<span>Process PDF</span>
										</>
									)}
								</button>
							</div>
						)}

						{/* Progress Bar */}
						{isUploading && (
							<div className="mt-4">
								<div className="flex items-center justify-between text-sm text-gray-600 mb-2">
									<span>Processing PDF...</span>
									<span>{Math.round(uploadProgress)}%</span>
								</div>
								<div className="w-full bg-gray-200 rounded-full h-2">
									<div
										className="bg-blue-600 h-2 rounded-full transition-all duration-300"
										style={{ width: `${uploadProgress}%` }}
									></div>
								</div>
							</div>
						)}
					</div>

					{/* Extracted Text Section */}
					{extractedText && (
						<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-lg font-medium text-gray-900 flex items-center">
									<FileText className="w-5 h-5 mr-2" />
									Extracted Text
								</h3>
								<button
									onClick={resetForm}
									className="text-sm text-gray-500 hover:text-gray-700"
								>
									Reset
								</button>
							</div>
							<div className="bg-gray-50 rounded-lg p-4">
								<pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
									{extractedText}
								</pre>
							</div>
						</div>
					)}

					{/* AI Analysis Section */}
					
				</div>
			</div>
		</Layout>
	);
};

export default withAuth(UploadPDFPage, {
	title: "Upload PDF - Oren ESG",
});
