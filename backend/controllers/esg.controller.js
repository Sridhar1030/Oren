import { ESGService } from "../models/esg.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";

// Get ESG metrics metadata
const getMetricsMetadata = asyncHandler(async (req, res) => {
	const metadata = ESGService.getMetricsMetadata();
	
	res.status(200).json({
		message: "ESG metrics metadata retrieved successfully",
		data: metadata,
	});
});

// Save or update ESG response
const saveESGResponse = asyncHandler(async (req, res) => {
	const { financialYear, ...esgData } = req.body;
	const userId = req.user.id;

	// Validate financial year
	if (!financialYear || typeof financialYear !== 'number') {
		res.status(400);
		throw new Error("Financial year is required and must be a number");
	}

	// Validate financial year range (reasonable range)
	const currentYear = new Date().getFullYear();
	if (financialYear < 2000 || financialYear > currentYear + 1) {
		res.status(400);
		throw new Error(`Financial year must be between 2000 and ${currentYear + 1}`);
	}

	// Filter out undefined/null values and convert strings to numbers where appropriate
	const cleanedData = {};
	Object.keys(esgData).forEach(key => {
		if (esgData[key] !== null && esgData[key] !== undefined && esgData[key] !== '') {
			// Convert string numbers to actual numbers for numeric fields
			if (typeof esgData[key] === 'string' && !isNaN(esgData[key]) && key !== 'hasDataPrivacyPolicy') {
				cleanedData[key] = parseFloat(esgData[key]);
			} else if (key === 'hasDataPrivacyPolicy') {
				// Convert Yes/No to boolean
				cleanedData[key] = esgData[key] === 'Yes' || esgData[key] === true;
			} else {
				cleanedData[key] = esgData[key];
			}
		}
	});

	try {
		const response = await ESGService.createOrUpdate(userId, financialYear, cleanedData);

		res.status(200).json({
			message: "ESG response saved successfully",
			data: response,
		});
	} catch (error) {
		res.status(500);
		throw new Error("Failed to save ESG response: " + error.message);
	}
});

// Get all ESG responses for the authenticated user
const getESGResponses = asyncHandler(async (req, res) => {
	const userId = req.user.id;

	try {
		const responses = await ESGService.getByUserId(userId);

		res.status(200).json({
			message: "ESG responses retrieved successfully",
			data: responses,
		});
	} catch (error) {
		res.status(500);
		throw new Error("Failed to retrieve ESG responses: " + error.message);
	}
});

// Get ESG response for a specific financial year
const getESGResponseByYear = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const { year } = req.params;

	// Validate year parameter
	const financialYear = parseInt(year);
	if (isNaN(financialYear)) {
		res.status(400);
		throw new Error("Invalid financial year parameter");
	}

	try {
		const response = await ESGService.getByUserAndYear(userId, financialYear);

		if (!response) {
			res.status(404);
			throw new Error("ESG response not found for the specified year");
		}

		res.status(200).json({
			message: "ESG response retrieved successfully",
			data: response,
		});
	} catch (error) {
		if (error.message.includes("not found")) {
			res.status(404);
			throw error;
		}
		res.status(500);
		throw new Error("Failed to retrieve ESG response: " + error.message);
	}
});

// Delete ESG response for a specific financial year
const deleteESGResponse = asyncHandler(async (req, res) => {
	const userId = req.user.id;
	const { year } = req.params;

	// Validate year parameter
	const financialYear = parseInt(year);
	if (isNaN(financialYear)) {
		res.status(400);
		throw new Error("Invalid financial year parameter");
	}

	try {
		await ESGService.delete(userId, financialYear);

		res.status(200).json({
			message: "ESG response deleted successfully",
		});
	} catch (error) {
		if (error.code === 'P2025') { // Prisma record not found error
			res.status(404);
			throw new Error("ESG response not found for the specified year");
		}
		res.status(500);
		throw new Error("Failed to delete ESG response: " + error.message);
	}
});

// Get all financial years for which user has ESG data
const getFinancialYears = asyncHandler(async (req, res) => {
	const userId = req.user.id;

	try {
		const years = await ESGService.getFinancialYears(userId);

		res.status(200).json({
			message: "Financial years retrieved successfully",
			data: years,
		});
	} catch (error) {
		res.status(500);
		throw new Error("Failed to retrieve financial years: " + error.message);
	}
});

// Get ESG summary/dashboard data
const getESGSummary = asyncHandler(async (req, res) => {
	const userId = req.user.id;

	try {
		const responses = await ESGService.getByUserId(userId);

		// Calculate summary statistics
		const summary = {
			totalResponses: responses.length,
			financialYears: responses.map(r => r.financialYear).sort((a, b) => b - a),
			latestResponse: responses.length > 0 ? responses[0] : null,
			trends: {
				carbonEmissions: responses.map(r => ({
					year: r.financialYear,
					value: r.carbonEmissions
				})).filter(item => item.value !== null),
				totalRevenue: responses.map(r => ({
					year: r.financialYear,
					value: r.totalRevenue
				})).filter(item => item.value !== null),
				totalEmployees: responses.map(r => ({
					year: r.financialYear,
					value: r.totalEmployees
				})).filter(item => item.value !== null),
				diversityRatio: responses.map(r => ({
					year: r.financialYear,
					value: r.diversityRatio
				})).filter(item => item.value !== null),
			}
		};

		res.status(200).json({
			message: "ESG summary retrieved successfully",
			data: summary,
		});
	} catch (error) {
		res.status(500);
		throw new Error("Failed to retrieve ESG summary: " + error.message);
	}
});

export { 
	getMetricsMetadata,
	saveESGResponse, 
	getESGResponses, 
	getESGResponseByYear, 
	deleteESGResponse, 
	getFinancialYears,
	getESGSummary 
};
