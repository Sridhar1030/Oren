import { UserService } from "../utils/user.utils.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessTokenAndRefreshToken = async (user) => {
	try {
		// Generate access token and refresh token
		const { accessToken, refreshToken } = await UserService.generateTokens(user);

		return { accessToken, refreshToken };
	} catch (error) {
		throw new Error(
			"Something went wrong while generating refresh and access token"
		);
	}
};

const registerUser = asyncHandler(async (req, res) => {
	const { fullName, email, password, username } = req.body;

	// Check if all fields are provided
	if (
		!fullName?.trim() ||
		!email?.trim() ||
		!password?.trim() ||
		!username?.trim()
	) {
		res.status(400);
		throw new Error("All fields are required");
	}

	// Check if user already exists
	const userExists = await UserService.findByEmailOrUsername(email, username);

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	// Create the new user
	const user = await UserService.create({ fullName, email, password, username });

	if (!user) {
		res.status(400);
		throw new Error("Invalid user data");
	}

	res.status(201).json({
		message: "User registered successfully",
		user: user,
	});
});

const loginUser = asyncHandler(async (req, res) => {
	const { email, username, password } = req.body;

	// Check if all fields are provided
	if ((!email && !username) || !password) {
		res.status(400);
		throw new Error("All fields are required");
	}

	// Find user by email or username
	const user = await UserService.findByEmailOrUsername(email, username);
	
	if (!user) {
		res.status(404);
		throw new Error("User not found");
	}

	// Check if password is correct
	const isPasswordCorrect = await UserService.comparePassword(password, user.password);

	if (!isPasswordCorrect) {
		res.status(401);
		throw new Error("Invalid credentials");
	}

	// Generate access token and refresh token
	const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);

	// Remove sensitive fields before sending response
	const userData = {
		id: user.id,
		username: user.username,
		email: user.email,
		fullName: user.fullName,
		createdAt: user.createdAt,
		updatedAt: user.updatedAt,
	};

	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	};

	return res
		.status(200)
		.cookie("refreshToken", refreshToken, options)
		.cookie("accessToken", accessToken, options)
		.json({
			message: "User logged in successfully",
			user: userData,
			accessToken,
		});
});

const logoutUser = asyncHandler(async (req, res) => {
	await UserService.clearRefreshToken(req?.user?.id);   

	const options = {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'strict',
	};

	return res
		.status(200)
		.clearCookie("refreshToken", options)
		.clearCookie("accessToken", options)
		.json({
			message: "User logged out successfully",
		});
});

export { registerUser, loginUser, logoutUser };
