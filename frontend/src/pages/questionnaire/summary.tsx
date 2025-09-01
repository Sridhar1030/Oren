import React, { useState, useEffect } from "react";
import { withAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout/Layout";
import {
	BarChart3,
	TrendingUp,
	Users,
	Leaf,
	Building,
	Download,
	ArrowLeft,
	FileText,
	FileSpreadsheet,
	AlertCircle,
} from "lucide-react";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	LineChart,
	Line,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import Link from "next/link";
import { esgAPI, handleApiError } from "@/utils/api";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface ESGData {
	id: string;
	financialYear: number;
	totalElectricityConsumption: number;
	renewableElectricityConsumption: number;
	totalFuelConsumption: number;
	carbonEmissions: number;
	totalEmployees: number;
	femaleEmployees: number;
	averageTrainingHours: number;
	communityInvestmentSpend: number;
	independentBoardMembersPercent: number;
	hasDataPrivacyPolicy: boolean;
	totalRevenue: number;
	createdAt: string;
	updatedAt: string;
}

const SummaryPage: React.FC = () => {
	const [esgData, setEsgData] = useState<ESGData[]>([]);
	const [selectedYearData, setSelectedYearData] = useState<ESGData | null>(
		null
	);
	const [financialYears, setFinancialYears] = useState<number[]>([]);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);
	const [yearDataLoading, setYearDataLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [selectedYear, setSelectedYear] = useState<number | null>(null);

	useEffect(() => {
		fetchFinancialYears();
	}, []);

	useEffect(() => {
		if (selectedYear) {
			console.log("useEffect triggered for selectedYear:", selectedYear);
			fetchYearData(selectedYear);
		}
	}, [selectedYear]);

	const fetchFinancialYears = async () => {
		try {
			setLoading(true);
			setError(null);

			const response = await esgAPI.getFinancialYears();
			const years = response.data.data;

			if (years && Array.isArray(years)) {
				// Sort years in descending order (newest first)
				const sortedYears = years.sort((a, b) => b - a);
				setFinancialYears(sortedYears);
				
				// Set the most recent year as selected by default
				if (sortedYears.length > 0) {
					const mostRecentYear = sortedYears[0]; // First element after sorting descending
					setSelectedYear(mostRecentYear);
				}
			} else {
				setFinancialYears([]);
			}
		} catch (err) {
			console.error("Error fetching financial years:", err);
			setError("Failed to load financial years. Please try again.");
			handleApiError(err);
		} finally {
			setLoading(false);
		}
	};

	const fetchYearData = async (year: number) => {
		try {
			setYearDataLoading(true);
			setError(null);

			console.log(`Fetching data for year: ${year}`);
			const response = await esgAPI.getResponseByYear(year);
			console.log("API Response:", response);

			const data = response.data.data;
			console.log("Extracted data:", data);

			if (data) {
				setSelectedYearData(data);
				console.log("Set selected year data:", data);
			} else {
				setSelectedYearData(null);
				console.log("No data found for year:", year);
			}
		} catch (err) {
			console.error(`Error fetching data for year ${year}:`, err);
			setError(`Failed to load data for FY ${year}. Please try again.`);
			handleApiError(err);
		} finally {
			setYearDataLoading(false);
		}
	};

	const handleRefresh = async () => {
		try {
			setRefreshing(true);
			setError(null);

			// Refresh all data
			await Promise.all([fetchFinancialYears(), fetchESGData(true)]);

			// If we have a selected year, refresh that data too
			if (selectedYear) {
				await fetchYearData(selectedYear);
			}
		} catch (err) {
			console.error("Error refreshing data:", err);
			setError("Failed to refresh data. Please try again.");
		} finally {
			setRefreshing(false);
		}
	};

	const fetchESGData = async (isRefresh = false) => {
		try {
			setError(null);

			const response = await esgAPI.getResponses();
			const data = response.data.data;

			if (data && Array.isArray(data)) {
				setEsgData(data);
			} else {
				setEsgData([]);
			}
		} catch (err) {
			console.error("Error fetching ESG data:", err);
			setError("Failed to load ESG data. Please try again.");
			handleApiError(err);
		}
	};

	// Use selectedYearData for the selected year, fallback to esgData for comparison
	const selectedData = selectedYearData;

	// Chart data preparation - show data for only the selected year
	const yearlyComparisonData =
		selectedYear && selectedData
			? [
					{
						year: selectedYear,
						carbonEmissions: selectedData.carbonEmissions,
						renewableRatio:
							selectedData.totalElectricityConsumption > 0
								? (selectedData.renewableElectricityConsumption /
										selectedData.totalElectricityConsumption) *
								  100
								: 0,
						diversityRatio:
							selectedData.totalEmployees > 0
								? (selectedData.femaleEmployees /
										selectedData.totalEmployees) *
								  100
								: 0,
						communitySpendRatio:
							selectedData.totalRevenue > 0
								? (selectedData.communityInvestmentSpend /
										selectedData.totalRevenue) *
								  100
								: 0,
					},
			  ]
			: [];

	// Debug logging
	console.log("Selected Year:", selectedYear);
	console.log("Selected Data:", selectedData);
	console.log("Yearly Comparison Data:", yearlyComparisonData);

	const pieData = selectedData
		? [
				{ name: "Environmental", value: 35, color: "#10b981" },
				{ name: "Social", value: 40, color: "#3b82f6" },
				{ name: "Governance", value: 25, color: "#8b5cf6" },
		  ]
		: [];

	const handleDownloadPDF = async () => {
		if (!selectedData || !selectedYear) {
			alert("Please select a financial year with data to download PDF");
			return;
		}

		try {
			// Create a temporary container for PDF generation
			const pdfContainer = document.createElement('div');
			pdfContainer.style.position = 'absolute';
			pdfContainer.style.left = '-9999px';
			pdfContainer.style.top = '0';
			pdfContainer.style.width = '800px';
			pdfContainer.style.backgroundColor = 'white';
			pdfContainer.style.padding = '20px';
			pdfContainer.style.fontFamily = 'Arial, sans-serif';
			document.body.appendChild(pdfContainer);

			// Generate PDF content
			pdfContainer.innerHTML = `
				<div style="text-align: center; margin-bottom: 30px;">
					<h1 style="color: #1f2937; font-size: 28px; margin-bottom: 10px;">ESG Summary Report</h1>
					<h2 style="color: #6b7280; font-size: 20px; margin-bottom: 5px;">Financial Year ${selectedYear}</h2>
					<p style="color: #9ca3af; font-size: 14px;">Generated on ${new Date().toLocaleDateString()}</p>
				</div>

				<div style="margin-bottom: 30px;">
					<h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Key Performance Metrics</h3>
					<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
						<div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #10b981;">
							<h4 style="color: #10b981; font-size: 16px; margin-bottom: 5px;">Carbon Intensity</h4>
							<p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
								${selectedData.totalRevenue > 0 ? (selectedData.carbonEmissions / selectedData.totalRevenue).toFixed(2) : 'N/A'}
							</p>
							<p style="color: #6b7280; font-size: 12px; margin: 0;">T CO2e / INR</p>
						</div>
						<div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #3b82f6;">
							<h4 style="color: #3b82f6; font-size: 16px; margin-bottom: 5px;">Renewable Energy</h4>
							<p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
								${selectedData.totalElectricityConsumption > 0 ? ((selectedData.renewableElectricityConsumption / selectedData.totalElectricityConsumption) * 100).toFixed(2) : 'N/A'}%
							</p>
							<p style="color: #6b7280; font-size: 12px; margin: 0;">Clean energy ratio</p>
						</div>
						<div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #8b5cf6;">
							<h4 style="color: #8b5cf6; font-size: 16px; margin-bottom: 5px;">Diversity Ratio</h4>
							<p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
								${selectedData.totalEmployees > 0 ? ((selectedData.femaleEmployees / selectedData.totalEmployees) * 100).toFixed(2) : 'N/A'}%
							</p>
							<p style="color: #6b7280; font-size: 12px; margin: 0;">Gender diversity</p>
						</div>
						<div style="background: #f9fafb; padding: 15px; border-radius: 8px; border-left: 4px solid #f97316;">
							<h4 style="color: #f97316; font-size: 16px; margin-bottom: 5px;">Community Spend</h4>
							<p style="color: #1f2937; font-size: 24px; font-weight: bold; margin: 0;">
								${selectedData.totalRevenue > 0 ? ((selectedData.communityInvestmentSpend / selectedData.totalRevenue) * 100).toFixed(2) : 'N/A'}%
							</p>
							<p style="color: #6b7280; font-size: 12px; margin: 0;">Of total revenue</p>
						</div>
					</div>
				</div>

				<div style="margin-bottom: 30px;">
					<h3 style="color: #1f2937; font-size: 18px; margin-bottom: 15px; border-bottom: 2px solid #e5e7eb; padding-bottom: 5px;">Detailed Metrics</h3>
					<table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
						<thead>
							<tr style="background: #f3f4f6;">
								<th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: bold; color: #1f2937;">Category</th>
								<th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: bold; color: #1f2937;">Metric</th>
								<th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: bold; color: #1f2937;">Value</th>
								<th style="border: 1px solid #d1d5db; padding: 12px; text-align: left; font-weight: bold; color: #1f2937;">Unit</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Environmental</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Total Electricity Consumption</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.totalElectricityConsumption.toLocaleString()}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">kWh</td>
							</tr>
							<tr style="background: #f9fafb;">
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Environmental</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Renewable Electricity</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.renewableElectricityConsumption.toLocaleString()}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">kWh</td>
							</tr>
							<tr>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Environmental</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Carbon Emissions</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.carbonEmissions.toFixed(2)}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">T CO2e</td>
							</tr>
							<tr style="background: #f9fafb;">
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Social</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Total Employees</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.totalEmployees.toLocaleString()}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">-</td>
							</tr>
							<tr>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Social</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Female Employees</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.femaleEmployees.toLocaleString()}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">-</td>
							</tr>
							<tr style="background: #f9fafb;">
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Social</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Average Training Hours</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.averageTrainingHours}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Hours</td>
							</tr>
							<tr>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Social</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Community Investment</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">₹${selectedData.communityInvestmentSpend.toLocaleString()}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">INR</td>
							</tr>
							<tr style="background: #f9fafb;">
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Governance</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Independent Board Members</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.independentBoardMembersPercent}%</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">%</td>
							</tr>
							<tr>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Governance</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Data Privacy Policy</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">${selectedData.hasDataPrivacyPolicy ? 'Yes' : 'No'}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">-</td>
							</tr>
							<tr style="background: #f9fafb;">
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">Financial</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937;">Total Revenue</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #1f2937; font-weight: bold;">₹${selectedData.totalRevenue.toLocaleString()}</td>
								<td style="border: 1px solid #d1d5db; padding: 12px; color: #6b7280;">INR</td>
							</tr>
						</tbody>
					</table>
				</div>



				<div style="text-align: center; color: #6b7280; font-size: 12px; border-top: 1px solid #e5e7eb; padding-top: 20px;">
					<p>This report was generated automatically from the ESG questionnaire data.</p>
					<p>For questions or support, please contact your ESG team.</p>
				</div>
			`;

			// Convert HTML to canvas
			const canvas = await html2canvas(pdfContainer, {
				scale: 2,
				useCORS: true,
				allowTaint: true,
				backgroundColor: '#ffffff'
			});

			// Create PDF
			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF('p', 'mm', 'a4');
			const imgWidth = 210; // A4 width in mm
			const pageHeight = 295; // A4 height in mm
			const imgHeight = (canvas.height * imgWidth) / canvas.width;
			let heightLeft = imgHeight;

			let position = 0;

			// Add first page
			pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
			heightLeft -= pageHeight;

			// Add additional pages if content is longer than one page
			while (heightLeft >= 0) {
				position = heightLeft - imgHeight;
				pdf.addPage();
				pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
				heightLeft -= pageHeight;
			}

			// Save PDF
			pdf.save(`ESG_Summary_FY${selectedYear}_${new Date().toISOString().split('T')[0]}.pdf`);

			// Clean up
			document.body.removeChild(pdfContainer);

		} catch (error) {
			console.error('Error generating PDF:', error);
			alert('Failed to generate PDF. Please try again.');
		}
	};

	const handleDownloadExcel = () => {
		// TODO: Implement Excel download
		alert("Excel download functionality will be implemented here");
	};

	if (loading) {
		return (
			<Layout title="ESG Summary - Oren">
				<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B]">
					<div className="text-center">
						<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBE8E1] mx-auto mb-4"></div>
						<p className="text-gray-600">Loading ESG summary...</p>
					</div>
				</div>
			</Layout>
		);
	}

	if (error) {
		return (
			<Layout title="ESG Summary - Oren">
				<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B]">
					<div className="text-center">
						<div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
							<AlertCircle className="w-8 h-8 text-red-600" />
						</div>
						<h2 className="text-xl font-semibold text-gray-900 mb-2">
							Error Loading Data
						</h2>
						<p className="text-gray-600 mb-4">{error}</p>
						<button
							onClick={fetchFinancialYears}
							className="bg-[#BBE8E1] hover:bg-[#A8D8D1] text-white font-medium py-2 px-4 rounded-lg transition-colors"
						>
							Try Again
						</button>
					</div>
				</div>
			</Layout>
		);
	}

	if (financialYears.length === 0) {
		return (
			<Layout title="ESG Summary - Oren">
				<div className="min-h-screen bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] py-8">
					<div className="max-w-7xl mx-auto px-4">
						<div className="mb-8">
							<Link
								href="/questionnaire"
								className="inline-flex items-center text-[#BBE8E1] hover:text-[#A8D8D1] mb-4 transition-colors"
							>
								<ArrowLeft className="w-4 h-4 mr-2" />
								Back to Questionnaire
							</Link>
							<h1 className="text-3xl font-bold text-gray-900 mb-2">
								ESG Summary Dashboard
							</h1>
							<p className="text-gray-600">
								Comprehensive overview of your sustainability
								metrics
							</p>
						</div>

						<div className="bg-white/90 shadow-xl rounded-2xl p-12 text-center">
							<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<BarChart3 className="w-12 h-12 text-gray-400" />
							</div>
							<h2 className="text-2xl font-semibold text-gray-900 mb-2">
								No ESG Data Available
							</h2>
							<p className="text-gray-600 mb-6">
								You haven't submitted any ESG questionnaires
								yet. Complete a questionnaire to see your
								summary dashboard.
							</p>
							<Link
								href="/questionnaire"
								className="bg-[#BBE8E1] hover:bg-[#A8D8D1] text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center"
							>
								<BarChart3 className="w-4 h-4 mr-2" />
								Complete ESG Questionnaire
							</Link>
						</div>
					</div>
				</div>
			</Layout>
		);
	}

	return (
		<Layout title="ESG Summary - Oren">
			<div className="min-h-screen bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] py-8">
				<div className="max-w-7xl mx-auto px-4">
					{/* Header */}
					<div className="mb-8">
						<Link
							href="/questionnaire"
							className="inline-flex items-center text-[#BBE8E1] hover:text-[#A8D8D1] mb-4 transition-colors"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Questionnaire
						</Link>
						<div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
							<div>
								<h1 className="text-3xl font-bold text-gray-900 mb-2">
									ESG Summary Dashboard
								</h1>
								<p className="text-gray-600">
									Comprehensive overview of your
									sustainability metrics
								</p>
							</div>
							<div className="flex gap-3">
								<button
									onClick={handleRefresh}
									disabled={refreshing}
									className="bg-blue-300 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{refreshing ? (
										<>
											<div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
											Refreshing...
										</>
									) : (
										<>
											<TrendingUp className="w-4 h-4 mr-2" />
											Refresh Data
										</>
									)}
								</button>
								<button
									onClick={handleDownloadPDF}
									className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
								>
									<FileText className="w-4 h-4 mr-2" />
									Download PDF
								</button>
								<button
									onClick={handleDownloadExcel}
									className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
								>
									<FileSpreadsheet className="w-4 h-4 mr-2" />
									Download Excel
								</button>
							</div>
						</div>
					</div>

					{/* Year Selector */}
					<div className="bg-white/90 shadow-xl rounded-2xl p-6 mb-8">
						<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
							<h2 className="text-xl font-semibold text-gray-900">
								Select Financial Year
							</h2>
							<div className="text-sm text-gray-600">
								{financialYears.length} year
								{financialYears.length !== 1 ? "s" : ""} of data
								available
							</div>
						</div>
						<div className="flex flex-wrap gap-3">
							{financialYears
								.sort((a, b) => b - a) // Sort by year descending
								.map((year) => (
									<button
										key={year}
										onClick={() => setSelectedYear(year)}
										className={`px-4 py-2 rounded-lg font-medium transition-colors ${
											selectedYear === year
												? "bg-blue-400 text-white"
												: "bg-gray-200 text-gray-700 hover:bg-gray-200"
										}`}
									>
										FY {year}
									</button>
								))}
						</div>
					</div>

					{yearDataLoading && (
						<div className="bg-white/90 shadow-xl rounded-2xl p-12 text-center mb-8">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBE8E1] mx-auto mb-4"></div>
							<p className="text-gray-600">
								Loading data for FY {selectedYear}...
							</p>
						</div>
					)}

					{!yearDataLoading && !selectedData && selectedYear && (
						<div className="bg-white/90 shadow-xl rounded-2xl p-12 text-center mb-8">
							<div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
								<AlertCircle className="w-12 h-12 text-gray-400" />
							</div>
							<h2 className="text-2xl font-semibold text-gray-900 mb-2">
								No Data Available for FY {selectedYear}
							</h2>
							<p className="text-gray-600 mb-6">
								There is no ESG data available for the selected
								financial year. Please select a different year
								or complete a questionnaire for this year.
							</p>
						</div>
					)}

					{selectedData && !yearDataLoading && (
						<>
							{/* Key Metrics Cards */}
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
								<div className="bg-white/90 shadow-xl rounded-2xl p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600 mb-1">
												Carbon Intensity
											</p>
											<p className="text-2xl font-bold text-gray-900">
												{selectedData.totalRevenue > 0
													? (
															selectedData.carbonEmissions /
															selectedData.totalRevenue
													  ).toFixed(2)
													: "N/A"}
											</p>
											<p className="text-xs text-gray-500">
												T CO2e / INR
											</p>
										</div>
										<div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
											<Leaf className="w-6 h-6 text-green-600" />
										</div>
									</div>
								</div>

								<div className="bg-white/90 shadow-xl rounded-2xl p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600 mb-1">
												Renewable Energy
											</p>
											<p className="text-2xl font-bold text-gray-900">
												{selectedData.totalElectricityConsumption >
												0
													? (
															(selectedData.renewableElectricityConsumption /
																selectedData.totalElectricityConsumption) *
															100
													  ).toFixed(2)
													: "N/A"}
												%
											</p>
											<p className="text-xs text-gray-500">
												Clean energy ratio
											</p>
										</div>
										<div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
											<TrendingUp className="w-6 h-6 text-blue-600" />
										</div>
									</div>
								</div>

								<div className="bg-white/90 shadow-xl rounded-2xl p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600 mb-1">
												Diversity Ratio
											</p>
											<p className="text-2xl font-bold text-gray-900">
												{selectedData.totalEmployees > 0
													? (
															(selectedData.femaleEmployees /
																selectedData.totalEmployees) *
															100
													  ).toFixed(2)
													: "N/A"}
												%
											</p>
											<p className="text-xs text-gray-500">
												Gender diversity
											</p>
										</div>
										<div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
											<Users className="w-6 h-6 text-purple-600" />
										</div>
									</div>
								</div>

								<div className="bg-white/90 shadow-xl rounded-2xl p-6">
									<div className="flex items-center justify-between">
										<div>
											<p className="text-sm text-gray-600 mb-1">
												Community Spend
											</p>
											<p className="text-2xl font-bold text-gray-900">
												{selectedData.totalRevenue > 0
													? (
															(selectedData.communityInvestmentSpend /
																selectedData.totalRevenue) *
															100
													  ).toFixed(2)
													: "N/A"}
												%
											</p>
											<p className="text-xs text-gray-500">
												Of total revenue
											</p>
										</div>
										<div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
											<Building className="w-6 h-6 text-orange-600" />
										</div>
									</div>
								</div>
							</div>

							{/* Charts Section */}
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
								{/* Yearly Comparison */}
								<div className="bg-white/90 shadow-xl rounded-2xl p-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										ESG Performance for FY {selectedYear}
									</h3>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										{yearlyComparisonData.length > 0 &&
										selectedData ? (
											<BarChart
												data={yearlyComparisonData}
											>
												<CartesianGrid strokeDasharray="3 3" />
												<XAxis dataKey="year" />
												<YAxis />
												<Tooltip />
												<Bar
													dataKey="carbonEmissions"
													fill="#10b981"
													name="Carbon Emissions"
												/>
												<Bar
													dataKey="renewableRatio"
													fill="#3b82f6"
													name="Renewable Ratio %"
												/>
												<Bar
													dataKey="diversityRatio"
													fill="#8b5cf6"
													name="Diversity Ratio %"
												/>
											</BarChart>
										) : (
											<div className="flex items-center justify-center h-full text-gray-500">
												<div className="text-center">
													<p className="mb-2">
														No chart data available
														for the selected year
													</p>
													<p className="text-sm text-gray-400">
														Selected Year:{" "}
														{selectedYear} | Has
														Data:{" "}
														{selectedData
															? "Yes"
															: "No"}{" "}
														| Chart Data Length:{" "}
														{
															yearlyComparisonData.length
														}
													</p>
												</div>
											</div>
										)}
									</ResponsiveContainer>
								</div>

								{/* ESG Distribution */}
								<div className="bg-white/90 shadow-xl rounded-2xl p-6">
									<h3 className="text-lg font-semibold text-gray-900 mb-4">
										ESG Focus Distribution
									</h3>
									<ResponsiveContainer
										width="100%"
										height={300}
									>
										<PieChart>
											<Pie
												data={pieData}
												cx="50%"
												cy="50%"
												innerRadius={60}
												outerRadius={100}
												paddingAngle={5}
												dataKey="value"
											>
												{pieData.map((entry, index) => (
													<Cell
														key={`cell-${index}`}
														fill={entry.color}
													/>
												))}
											</Pie>
											<Tooltip />
										</PieChart>
									</ResponsiveContainer>
									<div className="flex justify-center space-x-6 mt-4">
										{pieData.map((item, index) => (
											<div
												key={index}
												className="flex items-center space-x-2"
											>
												<div
													className="w-3 h-3 rounded-full"
													style={{
														backgroundColor:
															item.color,
													}}
												></div>
												<span className="text-sm text-gray-600">
													{item.name} ({item.value}%)
												</span>
											</div>
										))}
									</div>
								</div>
							</div>

							{/* Detailed Metrics Table */}
							<div className="bg-white/90 shadow-xl rounded-2xl p-6">
								<h3 className="text-lg font-semibold text-gray-900 mb-4">
									Detailed Metrics for FY{" "}
									{selectedData.financialYear}
								</h3>
								<div className="overflow-x-auto">
									<table className="w-full">
										<thead>
											<tr className="border-b border-gray-200">
												<th className="text-left py-3 px-4 font-medium text-gray-900">
													Category
												</th>
												<th className="text-left py-3 px-4 font-medium text-gray-900">
													Metric
												</th>
												<th className="text-left py-3 px-4 font-medium text-gray-900">
													Value
												</th>
												<th className="text-left py-3 px-4 font-medium text-gray-900">
													Unit
												</th>
											</tr>
										</thead>
										<tbody>
											<tr className="border-b border-gray-100">
												<td className="py-3 px-4 text-sm text-gray-600">
													Environmental
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													Total Electricity
													Consumption
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													{selectedData.totalElectricityConsumption.toLocaleString()}
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													kWh
												</td>
											</tr>
											<tr className="border-b border-gray-100">
												<td className="py-3 px-4 text-sm text-gray-600">
													Environmental
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													Renewable Electricity
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													{selectedData.renewableElectricityConsumption.toLocaleString()}
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													kWh
												</td>
											</tr>
											<tr className="border-b border-gray-100">
												<td className="py-3 px-4 text-sm text-gray-600">
													Environmental
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													Carbon Emissions
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													{selectedData.carbonEmissions.toFixed(
														2
													)}
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													T CO2e
												</td>
											</tr>
											<tr className="border-b border-gray-100">
												<td className="py-3 px-4 text-sm text-gray-600">
													Social
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													Total Employees
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													{selectedData.totalEmployees.toLocaleString()}
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													-
												</td>
											</tr>
											<tr className="border-b border-gray-100">
												<td className="py-3 px-4 text-sm text-gray-600">
													Social
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													Female Employees
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													{selectedData.femaleEmployees.toLocaleString()}
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													-
												</td>
											</tr>
											<tr className="border-b border-gray-100">
												<td className="py-3 px-4 text-sm text-gray-600">
													Governance
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													Independent Board Members
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													{
														selectedData.independentBoardMembersPercent
													}
													%
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													%
												</td>
											</tr>
											<tr className="border-b border-gray-100">
												<td className="py-3 px-4 text-sm text-gray-600">
													Governance
												</td>
												<td className="py-4 text-sm text-gray-900">
													Data Privacy Policy
												</td>
												<td className="py-3 px-4 text-sm text-gray-900 capitalize">
													{selectedData.hasDataPrivacyPolicy
														? "Yes"
														: "No"}
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													-
												</td>
											</tr>
											<tr>
												<td className="py-3 px-4 text-sm text-gray-600">
													Financial
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													Total Revenue
												</td>
												<td className="py-3 px-4 text-sm text-gray-900">
													₹
													{selectedData.totalRevenue.toLocaleString()}
												</td>
												<td className="py-3 px-4 text-sm text-gray-500">
													INR
												</td>
											</tr>
										</tbody>
									</table>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</Layout>
	);
};

export default withAuth(SummaryPage, { title: "ESG Summary - Oren" });
