import React, { useState, useEffect } from "react";
import { withAuth } from "@/hooks/useAuth";
import Layout from "@/components/Layout/Layout";
import {
	Building,
	Leaf,
	Users,
	TrendingUp,
	Calendar,
	Save,
	ArrowLeft,
	AlertCircle,
	CheckCircle,
	BarChart3,
} from "lucide-react";
import Link from "next/link";
import { esgAPI, handleApiError, handleApiSuccess } from "@/utils/api";

interface ESGFormData {
	// Financial Year
	financialYear: number;
	
	// Environmental Metrics
	totalElectricityConsumption: number;
	renewableElectricityConsumption: number;
	totalFuelConsumption: number;
	carbonEmissions: number;

	// Social Metrics
	totalEmployees: number;
	femaleEmployees: number;
	averageTrainingHours: number;
	communityInvestmentSpend: number;

	// Governance Metrics
	independentBoardMembersPercent: number;
	hasDataPrivacyPolicy: boolean;
	totalRevenue: number;
}

interface ValidationErrors {
	[key: string]: string;
}

const QuestionnairePage: React.FC = () => {
	const [formData, setFormData] = useState<ESGFormData>({
		financialYear: new Date().getFullYear(),
		totalElectricityConsumption: 0,
		renewableElectricityConsumption: 0,
		totalFuelConsumption: 0,
		carbonEmissions: 0,
		totalEmployees: 0,
		femaleEmployees: 0,
		averageTrainingHours: 0,
		communityInvestmentSpend: 0,
		independentBoardMembersPercent: 0,
		hasDataPrivacyPolicy: false,
		totalRevenue: 0,
	});

	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isSubmitting, setIsSubmitting] = useState(false);

	// Auto-calculated metrics
	const carbonIntensity =
		formData.totalRevenue > 0
			? formData.carbonEmissions / formData.totalRevenue
			: 0;
	const renewableElectricityRatio =
		formData.totalElectricityConsumption > 0
			? (formData.renewableElectricityConsumption /
					formData.totalElectricityConsumption) *
			  100
			: 0;
	const diversityRatio =
		formData.totalEmployees > 0
			? (formData.femaleEmployees / formData.totalEmployees) * 100
			: 0;
	const communitySpendRatio =
		formData.totalRevenue > 0
			? (formData.communityInvestmentSpend / formData.totalRevenue) * 100
			: 0;

	const validateForm = (): boolean => {
		const newErrors: ValidationErrors = {};

		// Environmental validations
		if (
			formData.renewableElectricityConsumption >
			formData.totalElectricityConsumption
		) {
			newErrors.renewableElectricityConsumption =
				"Renewable consumption cannot exceed total consumption";
		}

		// Social validations
		if (formData.femaleEmployees > formData.totalEmployees) {
			newErrors.femaleEmployees =
				"Female employees cannot exceed total employees";
		}

		if (formData.averageTrainingHours < 0) {
			newErrors.averageTrainingHours =
				"Training hours cannot be negative";
		}

		// Governance validations
		if (formData.independentBoardMembersPercent > 100) {
			newErrors.independentBoardMembersPercent = "Percentage cannot exceed 100%";
		}

		if (formData.independentBoardMembersPercent < 0) {
			newErrors.independentBoardMembersPercent = "Percentage cannot be negative";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleInputChange = (
		e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
	) => {
		const { name, value, type } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: type === "number" ? parseFloat(value) || 0 : 
					name === "hasDataPrivacyPolicy" ? value === "true" : value,
		}));

		// Clear error when user starts typing
		if (errors[name]) {
			setErrors((prev) => ({ ...prev, [name]: "" }));
		}
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validateForm()) {
			return;
		}

		setIsSubmitting(true);

		try {
			console.log("Submitting ESG data:", formData);

			// Make API call to save ESG data
			const response = await esgAPI.saveResponse(formData);
			
			console.log("ESG data saved successfully:", response.data);
			handleApiSuccess("ESG data saved successfully!");

			// Reset form
			setFormData({
				financialYear: new Date().getFullYear(),
				totalElectricityConsumption: 0,
				renewableElectricityConsumption: 0,
				totalFuelConsumption: 0,
				carbonEmissions: 0,
				totalEmployees: 0,
				femaleEmployees: 0,
				averageTrainingHours: 0,
				communityInvestmentSpend: 0,
				independentBoardMembersPercent: 0,
				hasDataPrivacyPolicy: false,
				totalRevenue: 0,
			});

		} catch (error) {
			console.error("Error saving ESG data:", error);
			handleApiError(error);
		} finally {
			setIsSubmitting(false);
		}
	};

	const getInputClass = (fieldName: string) => {
		const baseClass =
			"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1]";
		return errors[fieldName]
			? `${baseClass} border-red-300 focus:ring-red-500 focus:border-red-500`
			: `${baseClass} border-gray-300`;
	};

	return (
		<Layout title="ESG Questionnaire - Oren">
			<div className="min-h-screen bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] py-8">
				<div className="max-w-6xl mx-auto px-4">
					{/* Header */}
					<div className="mb-8">
						<Link
							href="/dashboard"
							className="inline-flex items-center text-[#BBE8E1] hover:text-[#A8D8D1] mb-4 transition-colors"
						>
							<ArrowLeft className="w-4 h-4 mr-2" />
							Back to Dashboard
						</Link>
						<h1 className="text-3xl font-bold text-gray-900 mb-2">
							ESG Questionnaire
						</h1>
						<p className="text-gray-600">
							Complete your sustainability assessment for the
							financial year
						</p>
					</div>

					{/* Form */}
					<div className="bg-white/90 shadow-xl rounded-2xl p-8">
						<form onSubmit={handleSubmit} className="space-y-8">
							{/* Financial Year */}
							<div className="space-y-6">
								<h2 className="text-xl font-semibold text-gray-900 flex items-center">
									<Calendar className="w-5 h-5 mr-2 text-[#BBE8E1]" />
									Financial Year
								</h2>
								<p className="text-gray-600">
									Select the financial year for this ESG assessment.
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Financial Year *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="financialYear"
											value={formData.financialYear}
											onChange={handleInputChange}
											className={getInputClass(
												"financialYear"
											)}
											placeholder="2024"
											min="2000"
											max={new Date().getFullYear() + 1}
										/>
									</div>
								</div>
							</div>

							{/* Environmental Metrics */}
							<div className="space-y-6">
								<h2 className="text-xl font-semibold text-gray-900 flex items-center">
									<Leaf className="w-5 h-5 mr-2 text-[#BBE8E1]" />
									Environmental Metrics
								</h2>
								<p className="text-gray-600">
									Track your organization's environmental
									impact.
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Total Electricity Consumption *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="totalElectricityConsumption"
											value={
												formData.totalElectricityConsumption
											}
											onChange={handleInputChange}
											className={getInputClass(
												"totalElectricityConsumption"
											)}
											placeholder="0.00"
											min="0"
											step="0.01"
										/>
										<span className="text-sm text-gray-500">
											kWh
										</span>
										{errors.totalElectricityConsumption && (
											<div className="flex items-center mt-1 text-red-600 text-sm">
												<AlertCircle className="w-4 h-4 mr-1" />
												{
													errors.totalElectricityConsumption
												}
											</div>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Renewable Electricity Consumption *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="renewableElectricityConsumption"
											value={
												formData.renewableElectricityConsumption
											}
											onChange={handleInputChange}
											className={getInputClass(
												"renewableElectricityConsumption"
											)}
											placeholder="0.00"
											min="0"
											step="0.01"
										/>
										<span className="text-sm text-gray-500">
											kWh
										</span>
										{errors.renewableElectricityConsumption && (
											<div className="flex items-center mt-1 text-red-600 text-sm">
												<AlertCircle className="w-4 h-4 mr-1" />
												{
													errors.renewableElectricityConsumption
												}
											</div>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Total Fuel Consumption *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="totalFuelConsumption"
											value={
												formData.totalFuelConsumption
											}
											onChange={handleInputChange}
											className={getInputClass(
												"totalFuelConsumption"
											)}
											placeholder="0.00"
											min="0"
											step="0.01"
										/>
										<span className="text-sm text-gray-500">
											liters
										</span>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Carbon Emissions *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="carbonEmissions"
											value={formData.carbonEmissions}
											onChange={handleInputChange}
											className={getInputClass(
												"carbonEmissions"
											)}
											placeholder="0.00"
											min="0"
											step="0.01"
										/>
										<span className="text-sm text-gray-500">
											T CO2e
										</span>
									</div>
								</div>
							</div>

							{/* Social Metrics */}
							<div className="space-y-6">
								<h2 className="text-xl font-semibold text-gray-900 flex items-center">
									<Users className="w-5 h-5 mr-2 text-[#BBE8E1]" />
									Social Metrics
								</h2>
								<p className="text-gray-600">
									Measure your organization's social impact
									and workforce diversity.
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Total Number of Employees *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="totalEmployees"
											value={formData.totalEmployees}
											onChange={handleInputChange}
											className={getInputClass(
												"totalEmployees"
											)}
											placeholder="0"
											min="0"
										/>
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Number of Female Employees *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="femaleEmployees"
											value={formData.femaleEmployees}
											onChange={handleInputChange}
											className={getInputClass(
												"femaleEmployees"
											)}
											placeholder="0"
											min="0"
										/>
										{errors.femaleEmployees && (
											<div className="flex items-center mt-1 text-red-600 text-sm">
												<AlertCircle className="w-4 h-4 mr-1" />
												{errors.femaleEmployees}
											</div>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Average Training Hours *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="averageTrainingHours"
											value={
												formData.averageTrainingHours
											}
											onChange={handleInputChange}
											className={getInputClass(
												"averageTrainingHours"
											)}
											placeholder="0.0"
											min="0"
											step="0.1"
										/>
										{errors.averageTrainingHours && (
											<div className="flex items-center mt-1 text-red-600 text-sm">
												<AlertCircle className="w-4 h-4 mr-1" />
												{errors.averageTrainingHours}
											</div>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Community Investment *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="communityInvestmentSpend"
											value={formData.communityInvestmentSpend}
											onChange={handleInputChange}
											className={getInputClass(
												"communityInvestmentSpend"
											)}
											placeholder="0.00"
											min="0"
											step="0.01"
										/>
										<span className="text-sm text-gray-500">
											INR
										</span>
									</div>
								</div>
							</div>

							{/* Governance Metrics */}
							<div className="space-y-6">
								<h2 className="text-xl font-semibold text-gray-900 flex items-center">
									<Building className="w-5 h-5 mr-2 text-[#BBE8E1]" />
									Governance Metrics
								</h2>
								<p className="text-gray-600">
									Assess your organization's governance
									practices and transparency.
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											% of Independent Board Members *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="independentBoardMembersPercent"
											value={
												formData.independentBoardMembersPercent
											}
											onChange={handleInputChange}
											className={getInputClass(
												"independentBoardMembersPercent"
											)}
											placeholder="0.0"
											min="0"
											max="100"
											step="0.1"
										/>
										<span className="text-sm text-gray-500">
											%
										</span>
										{errors.independentBoardMembersPercent && (
											<div className="flex items-center mt-1 text-red-600 text-sm">
												<AlertCircle className="w-4 h-4 mr-1" />
												{errors.independentBoardMembersPercent}
											</div>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Data Privacy Policy *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<select
											name="hasDataPrivacyPolicy"
											value={
												formData.hasDataPrivacyPolicy ? "true" : "false"
											}
											onChange={handleInputChange}
											className={getInputClass(
												"hasDataPrivacyPolicy"
											)}
										>
											<option value="false">
												Select an option
											</option>
											<option value="true">Yes</option>
											<option value="false">No</option>
										</select>
										{errors.hasDataPrivacyPolicy && (
											<div className="flex items-center mt-1 text-red-600 text-sm">
												<AlertCircle className="w-4 h-4 mr-1" />
												{errors.hasDataPrivacyPolicy}
											</div>
										)}
									</div>

									<div>
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Total Revenue *{" "}
											<span className="text-red-500">
												*
											</span>
										</label>
										<input
											type="number"
											name="totalRevenue"
											value={formData.totalRevenue}
											onChange={handleInputChange}
											className={getInputClass(
												"totalRevenue"
											)}
											placeholder="0.00"
											min="0"
											step="0.01"
										/>
										<span className="text-sm text-gray-500">
											INR
										</span>
									</div>
								</div>
							</div>

							{/* Auto-Calculated Metrics */}
							<div className="space-y-6">
								<div className="flex items-center gap-2">
									<TrendingUp className="w-5 h-5 text-[#BBE8E1]" />
									<h2 className="text-xl font-semibold text-gray-900">
										Auto-Calculated Metrics
									</h2>
									<span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
										Real-time calculation
									</span>
								</div>
								<p className="text-gray-600">
									These metrics are automatically calculated
									based on your inputs.
								</p>

								<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Carbon Intensity
										</label>
										<div className="text-2xl font-bold text-gray-900">
											{carbonIntensity.toFixed(6)}
										</div>
										<span className="text-sm text-gray-500">
											T CO2e / INR
										</span>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Renewable Electricity Ratio
										</label>
										<div className="text-2xl font-bold text-gray-900">
											{renewableElectricityRatio.toFixed(
												2
											)}
										</div>
										<span className="text-sm text-gray-500">
											%
										</span>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Diversity Ratio
										</label>
										<div className="text-2xl font-bold text-gray-900">
											{diversityRatio.toFixed(2)}
										</div>
										<span className="text-sm text-gray-500">
											%
										</span>
									</div>

									<div className="bg-gray-50 p-4 rounded-lg">
										<label className="block text-sm font-medium text-gray-700 mb-2">
											Community Spend Ratio
										</label>
										<div className="text-2xl font-bold text-gray-900">
											{communitySpendRatio.toFixed(4)}
										</div>
										<span className="text-sm text-gray-500">
											%
										</span>
									</div>
								</div>
							</div>

							{/* Submit Button */}
							<div className="pt-6 border-t border-gray-200">
								<button
									type="submit"
									disabled={isSubmitting}
									className="w-full bg-[#BBE8E1] hover:bg-[#A8D8D1] text-white font-semibold py-3 px-6 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
								>
									{isSubmitting ? (
										<>
											<div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
											Saving...
										</>
									) : (
										<>
											<Save className="w-5 h-5 mr-2" />
											Save ESG Data
										</>
									)}
								</button>

								{/* Summary Link */}
								<div className="mt-4 text-center">
									<Link
										href="/questionnaire/summary"
										className="inline-flex items-center text-[#BBE8E1] hover:text-[#A8D8D1] font-medium transition-colors"
									>
										<BarChart3 className="w-4 h-4 mr-2" />
										View ESG Summary Dashboard
									</Link>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		</Layout>
	);
};

export default withAuth(QuestionnairePage, {
	title: "ESG Questionnaire - Oren",
});
