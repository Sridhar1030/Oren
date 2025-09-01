import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { UserService } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
	try {
		const token =
			req.cookies?.accessToken ||
			req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			res.status(401);
			throw new Error("Unauthorized request");
		}

		const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

		const user = await UserService.findById(decodedToken?.id);

		if (!user) {
			res.status(401);
			throw new Error("Invalid Access Token");
		}

		req.user = user;
		next();
	} catch (error) {
		res.status(401);
		throw new Error(error?.message || "Invalid access token");
	}
});
