import { Router } from 'express';
import { verifyJWT } from '../middlewares/auth.middlewares.js';
import { 
	getMetricsMetadata,
	saveESGResponse, 
	getESGResponses, 
	getESGResponseByYear, 
	deleteESGResponse, 
	getFinancialYears,
	getESGSummary 
} from '../controllers/esg.controller.js';

const esgRouter = Router();

// Public route to get ESG metrics metadata (no auth required)
esgRouter.route("/metadata").get(getMetricsMetadata);

// All routes below require authentication
esgRouter.use(verifyJWT);

// ESG response routes
esgRouter.route("/responses")
	.get(getESGResponses)      // GET /api/v1/esg/responses - Get all responses for user
	.post(saveESGResponse);    // POST /api/v1/esg/responses - Save/update response

esgRouter.route("/responses/:year")
	.get(getESGResponseByYear)   // GET /api/v1/esg/responses/:year - Get response for specific year
	.delete(deleteESGResponse);  // DELETE /api/v1/esg/responses/:year - Delete response for specific year

// Utility routes
esgRouter.route("/years").get(getFinancialYears);  // GET /api/v1/esg/years - Get all years with data
esgRouter.route("/summary").get(getESGSummary);    // GET /api/v1/esg/summary - Get dashboard summary

export { esgRouter };
