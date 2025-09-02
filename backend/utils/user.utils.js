import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { prisma } from "../db/index.js";

class UserService {
	// Create a new user
	static async create({ username, email, fullName, password }) {
		// Hash password before storing
		const hashedPassword = await bcrypt.hash(password, 10);

		return await prisma.user.create({
			data: {
				username,
				email,
				fullName,
				password: hashedPassword,
			},
			select: {
				id: true,
				username: true,
				email: true,
				fullName: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	// Find user by email
	static async findByEmail(email) {
		return await prisma.user.findUnique({
			where: { email },
		});
	}

	// Find user by username
	static async findByUsername(username) {
		return await prisma.user.findUnique({
			where: { username },
		});
	}

	// Find user by email or username
	static async findByEmailOrUsername(email, username) {
		return await prisma.user.findFirst({
			where: {
				OR: [
					{ email: email || undefined },
					{ username: username || undefined },
				],
			},
		});
	}

	// Find user by ID
	static async findById(id) {
		return await prisma.user.findUnique({
			where: { id },
			select: {
				id: true,
				username: true,
				email: true,
				fullName: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	// Find user by ID with password (for authentication)
	static async findByIdWithPassword(id) {
		return await prisma.user.findUnique({
			where: { id },
		});
	}

	// Update user's refresh token
	static async updateRefreshToken(id, refreshToken) {
		return await prisma.user.update({
			where: { id },
			data: { refreshToken },
			select: {
				id: true,
				username: true,
				email: true,
				fullName: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	// Clear user's refresh token
	static async clearRefreshToken(id) {
		return await prisma.user.update({
			where: { id },
			data: { refreshToken: null },
			select: {
				id: true,
				username: true,
				email: true,
				fullName: true,
				createdAt: true,
				updatedAt: true,
			},
		});
	}

	// Compare password
	static async comparePassword(plainPassword, hashedPassword) {
		return await bcrypt.compare(plainPassword, hashedPassword);
	}

	// Generate access token
	static generateAccessToken(user) {
		return jwt.sign(
			{
				id: user.id,
				username: user.username,
				email: user.email,
			},
			process.env.ACCESS_TOKEN_SECRET,
			{
				expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "15m",
			}
		);
	}

	// Generate refresh token
	static generateRefreshToken(user) {
		return jwt.sign(
			{
				id: user.id,
			},
			process.env.REFRESH_TOKEN_SECRET,
			{
				expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "7d",
			}
		);
	}

	// Generate both tokens
	static async generateTokens(user) {
		const accessToken = this.generateAccessToken(user);
		const refreshToken = this.generateRefreshToken(user);

		// Update user with refresh token
		await this.updateRefreshToken(user.id, refreshToken);

		return { accessToken, refreshToken };
	}
}

export { UserService };
