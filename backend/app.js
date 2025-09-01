import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 100, // limit each IP to 100 requests per windowMs
	message: "Too many requests from this IP, please try again later."
});
app.use(limiter);

// CORS configuration
app.use(cors({
	origin: process.env.CORS_ORIGIN || "http://localhost:3000",
	credentials: true,
}));

// Body parsing middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));
app.use(cookieParser());

// Import routes
import { userRouter } from "./routes/user.routes.js";
import { esgRouter } from "./routes/esg.routes.js";

// Health check endpoint
app.get("/health", (req, res) => {
	res.status(200).json({
		status: "OK",
		message: "ESG Questionnaire API is running",
		timestamp: new Date().toISOString(),
	});
});

// API routes
app.use("/api/v1/auth", userRouter);
app.use("/api/v1/esg", esgRouter);

// 404 handler
app.use("*", (req, res) => {
	res.status(404).json({
		status: "error",
		message: "Route not found",
	});
});

// Global error handler
app.use((error, req, res, next) => {
	const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
	res.status(statusCode).json({
		status: "error",
		message: error.message,
		...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
	});
});

export { app };
