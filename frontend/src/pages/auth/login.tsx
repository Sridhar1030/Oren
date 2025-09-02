"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";

interface LoginForm {
	email: string;
	password: string;
}

const LoginPage: React.FC = () => {
	const [showPassword, setShowPassword] = useState(false);
	const { login, isLoading } = useAuth();
	const router = useRouter();
	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<LoginForm>();

	// Demo credentials
	const demoEmail = "sri@gmail.com";
	const demoPassword = "123456";

	const onSubmit = async (data: LoginForm) => {
		const success = await login(data.email, data.password);
		if (success) {
			router.push("/");
		}
	};

	const handleFillDemo = () => {
		setValue("email", demoEmail);
		setValue("password", demoPassword);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] p-4">
			<div className="w-full max-w-md">
				{/* Login Card */}
				<div className="bg-white/90 shadow-xl rounded-2xl p-6 sm:p-8">
					{/* Header */}
					<div className="text-center mb-8">
						<div className="w-16 h-16 bg-[#BBE8E1] rounded-xl flex items-center justify-center mx-auto mb-6">
							
						</div>
						<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Welcome back</h1>
						<p className="text-gray-600">Sign in to your Oren account</p>
					</div>

					{/* Form */}
					<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
						{/* Email */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Email Address
							</label>
							<input
								type="email"
								{...register("email", { required: "Email is required" })}
								className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1] text-sm transition-colors"
								placeholder="Enter your email"
							/>
							{errors.email && (
								<p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
							)}
						</div>

						{/* Password */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">
								Password
							</label>
							<div className="relative">
								<input
									type={showPassword ? "text" : "password"}
									{...register("password", { required: "Password is required" })}
									className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1] text-sm transition-colors pr-12"
									placeholder="Enter your password"
								/>
								<button
									type="button"
									className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
									onClick={() => setShowPassword(!showPassword)}
								>
									{showPassword ? 'Hide' : 'Show'}
								</button>
							</div>
							{errors.password && (
								<p className="mt-2 text-sm text-red-600">{errors.password.message}</p>
							)}
						</div>

						{/* Remember me and Forgot password */}
						<div className="flex items-center justify-between">
							<label className="flex items-center text-sm text-gray-600">
								<input type="checkbox" className="mr-2 accent-blue-400" /> Remember me
							</label>
							<Link href="#" className="text-sm text-blue-400 hover:text-blue-600 transition-colors">
								Forgot password?
							</Link>
						</div>

						{/* Submit Button */}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
						>
							{isLoading ? "Signing in..." : "Sign In"}
						</button>
					</form>

					{/* Demo Credentials */}
					<div className="mt-6 bg-gray-500 text-white font-bold border border-gray-200 rounded-lg p-4">
						<div className="flex items-center justify-between mb-2">
							<span className="text-sm  font-semibold">Demo Credentials:</span>
							<button
								type="button"
								onClick={handleFillDemo}
								className="text-xs bg-blue-400 hover:bg-blue-600 text-white px-2 py-1 rounded transition-colors"
							>
								Fill Demo Login
							</button>
						</div>
						<div className="flex flex-col gap-1 text-xs">
							<div>Email: <span className="text-yellow-400 font-medium">{demoEmail}</span></div>
							<div>Password: <span className="text-yellow-400 font-medium">{demoPassword}</span></div>
						</div>
					</div>

					{/* Register Link */}
					<div className="text-center mt-8">
						<p className="text-gray-600">
							Don't have an account?{' '}
							<Link href="/auth/register" className="text-blue-400 hover:text-blue-600 font-medium transition-colors">
								Sign up
							</Link>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
