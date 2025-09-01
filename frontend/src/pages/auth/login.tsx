"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth"; // adjust path if needed

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
	const demoEmail = "sridhar@gmail.com";
	const demoPassword = "sridhar1090";

	const onSubmit = async (data: LoginForm) => {
		const success = await login(data.email, data.password);
		if (success) {
			router.push("/dashboard");
		}
	};

	const handleFillDemo = () => {
		setValue("email", demoEmail);
		setValue("password", demoPassword);
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#23242a] to-[#18181c]">
			<div className="w-full max-w-md bg-[#23242a] rounded-2xl shadow-2xl p-8 border border-[#35363c]">
				<div className="flex flex-col items-center mb-6">
					<div className="bg-[#23242a] rounded-full p-3 border border-[#35363c] mb-4">
						{/* Oren icon */}
						<svg width="32" height="32" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#23242a"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="#3b82f6"/></svg>
					</div>
					<h2 className="text-2xl font-bold text-white text-center">Oren</h2>
					<p className="text-gray-400 text-center text-sm mt-1">Your intelligent expense management platform</p>
				</div>
				<div className="flex items-center justify-center gap-8 mb-6">
					<div className="flex flex-col items-center">
						{/* Smart icon */}
						<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#23242a"/><path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.5 6.5 0 0 1 9.5 3m0 2C12.54 5 15 7.46 15 10.5S12.54 16 9.5 16 4 13.54 4 10.5 6.46 5 9.5 5z" fill="#22c55e"/></svg>
						<span className="text-xs text-gray-400 mt-1">Smart</span>
					</div>
					<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M8 12h8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/></svg>
					<div className="flex flex-col items-center">
						{/* Secure icon */}
						<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#23242a"/><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="#3b82f6"/></svg>
						<span className="text-xs text-gray-400 mt-1">Secure</span>
					</div>
					<svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M8 12h8" stroke="#6b7280" strokeWidth="2" strokeLinecap="round"/></svg>
					<div className="flex flex-col items-center">
						{/* Fast icon */}
						<svg width="28" height="28" fill="none" viewBox="0 0 24 24"><rect width="24" height="24" rx="12" fill="#23242a"/><path d="M13 2.05v3.03c3.39.49 6 3.39 6 6.92 0 .9-.18 1.75-.48 2.54l2.6 1.53c.56-1.24.88-2.62.88-4.07 0-5.18-3.95-9.45-9-9.95zM12 19c-3.87 0-7-3.13-7-7 0-3.53 2.61-6.43 6-6.92V2.05c-5.06.5-9 4.76-9 9.95 0 5.52 4.47 10 9.99 10 3.31 0 6.24-1.61 8.06-4.09l-2.6-1.53C16.17 17.98 14.21 19 12 19z" fill="#a78bfa"/></svg>
						<span className="text-xs text-gray-400 mt-1">Fast</span>
					</div>
				</div>
				<form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
					{/* Email */}
					<div>
						<label className="block text-sm font-medium text-gray-300">Email Address</label>
						<input
							type="email"
							{...register("email", { required: "Email is required" })}
							className="mt-1 w-full border border-[#35363c] bg-[#23242a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
							placeholder="Email Address"
						/>
						{errors.email && (
							<p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
						)}
					</div>
					{/* Password */}
					<div>
						<label className="block text-sm font-medium text-gray-300">Password</label>
						<div className="relative">
							<input
								type={showPassword ? "text" : "password"}
								{...register("password", { required: "Password is required" })}
								className="mt-1 w-full border border-[#35363c] bg-[#23242a] text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-500"
								placeholder="Password"
							/>
							<button
								type="button"
								className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
								onClick={() => setShowPassword(!showPassword)}
							>
								{showPassword ? "Hide" : "Show"}
							</button>
						</div>
						{errors.password && (
							<p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
						)}
					</div>
					{/* Submit */}
					<button
						type="submit"
						disabled={isLoading}
						className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
					>
						{isLoading ? "Logging in..." : "Login to Oren"}
					</button>
					<div className="flex items-center justify-between mt-2">
						<label className="flex items-center text-xs text-gray-400">
							<input type="checkbox" className="mr-2 accent-blue-600" /> Remember me
						</label>
						<a href="#" className="text-xs text-blue-400 hover:underline">Forgot password?</a>
					</div>
				</form>
				{/* Demo Credentials */}
				<div className="mt-6 bg-[#23242a] border border-[#35363c] rounded-lg p-4">
					<div className="flex items-center justify-between mb-2">
						<span className="text-sm text-gray-300 font-semibold">Demo Credentials:</span>
						<button
							type="button"
							onClick={handleFillDemo}
							className="text-xs bg-blue-700 text-white px-2 py-1 rounded hover:bg-blue-800 transition-colors"
						>
							Fill Demo Login
						</button>
					</div>
					<div className="flex flex-col gap-1 text-xs text-gray-400">
						<div>Email: <span className="text-blue-300">{demoEmail}</span></div>
						<div>Password: <span className="text-blue-300">{demoPassword}</span></div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
