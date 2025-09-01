import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

export const AIResponseMiddleware = async (req, res, next) => {
	try {
		const { text } = req.body; // OCR-extracted text from PDF

		if (!text) {
			res.status(400);
			throw new Error("No OCR text provided in request body");
		}

		// Prompt Gemini to extract ESG data
		const prompt = `
        Extract ESG metrics from the following text and return JSON with keys:
        financialYear, totalElectricityConsumption, renewableElectricityConsumption,
        totalFuelConsumption, carbonEmissions, totalEmployees, femaleEmployees,
        averageTrainingHours, communityInvestmentSpend, independentBoardMembersPercent,
        hasDataPrivacyPolicy, totalRevenue.
        
        Respond with only valid JSON (no explanations).
        Return only valid JSON. Do not include explanations, code fences, or text.
        
        Input:
        ${text}
    `;

		const result = await model.generateContent(prompt);
		const aiResponse = cleanJsonResponse(result.response.candidates[0].content.parts[0].text);

		// Parse JSON from Gemini response
		let structuredData;
		try {
			structuredData = JSON.parse(aiResponse);
		} catch (e) {
			throw new Error(
				"Failed to parse AI response as JSON: " + aiResponse
			);
		}

		req.body.structuredData = structuredData;
		next();
	} catch (error) {
		console.error("AI Middleware Error:", error.message);
		res.status(500).json({
			status: "error",
			message: "AI processing failed: " + error.message,
		});
	}
};


function cleanJsonResponse(aiResponse) {
    return aiResponse
      .replace(/```json/g, "")  // remove starting ```json
      .replace(/```/g, "");     // remove ending ```
  }