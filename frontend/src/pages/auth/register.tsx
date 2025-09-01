"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { useAuth } from '@/hooks/useAuth';

interface RegisterForm {
  fullName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterForm>();

  const password = watch('password');

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...registerData } = data;
    const success = await registerUser(registerData);
    if (success) {
      router.push('/auth/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B] p-4">
      <div className="w-full max-w-md">
        {/* Registration Card */}
        <div className="bg-white/90 shadow-xl rounded-2xl p-6 sm:p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#BBE8E1] rounded-xl flex items-center justify-center mx-auto mb-6">
              {/* Oren logo with dots */}
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold text-white mb-1">Oren</div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
              </div>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Create account</h1>
            <p className="text-gray-600">Join Oren today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name Field */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <input
                {...register('fullName', {
                  required: 'Full name is required',
                  minLength: {
                    value: 2,
                    message: 'Full name must be at least 2 characters',
                  },
                })}
                type="text"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1] text-sm transition-colors"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-600">{errors.fullName.message}</p>
              )}
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  pattern: {
                    value: /^[a-zA-Z0-9_]+$/,
                    message: 'Username can only contain letters, numbers, and underscores',
                  },
                })}
                type="text"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1] text-sm transition-colors"
                placeholder="Choose a username"
              />
              {errors.username && (
                <p className="mt-2 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                type="email"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1] text-sm transition-colors"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1] text-sm transition-colors pr-12"
                  placeholder="Create a password"
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

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  {...register('confirmPassword', {
                    required: 'Please confirm your password',
                    validate: (value) =>
                      value === password || 'Passwords do not match',
                  })}
                  type={showConfirmPassword ? 'text' : 'password'}
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#BBE8E1] focus:border-[#BBE8E1] text-sm transition-colors pr-12"
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-2 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
                              <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-400 focus:ring-blue-400 border-gray-300 rounded mt-1"
                />
              <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                I agree to the{' '}
                <Link href="/terms" className="text-blue-400 hover:text-blue-600 transition-colors">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-blue-400 hover:text-blue-600 transition-colors">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-400 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-blue-400 hover:text-blue-600 font-medium transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
