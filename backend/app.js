import express from "express";
import cors from "cors";
import helmet from "helmet";

const app = express();

// Security middleware
app.use(helmet());



// CORS configuration
// Enable CORS for all origins
app.use(
	cors({
		origin: function (origin, callback) {
			// Allow requests with no origin (like mobile apps or Postman)
			if (!origin) return callback(null, true);
			
			// Allow all origins
			callback(null, true);
		},
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

// Body parsing middleware
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.json({ limit: "16kb" }));

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
		...(process.env.NODE_ENV === "development" && { stack: error.stack }),
	});
});

export { app };
