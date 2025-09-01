import React, {
	useState,
	useEffect,
	useContext,
	createContext,
	ReactNode,
} from "react";
import { useRouter } from "next/router";
import { authAPI, handleApiError, handleApiSuccess } from "@/utils/api";
import Layout from "@/components/Layout/Layout";

interface User {
	id: string;
	username: string;
	email: string;
	fullName: string;
	createdAt: string;
	updatedAt: string;
}

interface AuthContextType {
	user: User | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	login: (email: string, password: string) => Promise<boolean>;
	register: (data: {
		username: string;
		email: string;
		fullName: string;
		password: string;
	}) => Promise<boolean>;
	logout: () => void;
	refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	const getToken = () => {
		if (typeof window !== "undefined") {
			return localStorage.getItem("accessToken");
		}
		return null;
	};

	// Check if user is logged in on app load
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				const token = localStorage.getItem("accessToken");

				if (token) {
					try {
						// Basic token validation - check if token is not expired
						const tokenPayload = JSON.parse(
							atob(token.split(".")[1])
						);
						const currentTime = Date.now() / 1000;

						if (
							tokenPayload.exp &&
							tokenPayload.exp > currentTime
						) {
							console.log(
								"Valid token found, user is authenticated"
							);
							setIsAuthenticated(true);
							// Don't set user here, just mark as authenticated
						} else {
							// Token expired, clear data
							console.log("Token expired, clearing auth data");
							localStorage.removeItem("accessToken");
							setUser(null);
							setIsAuthenticated(false);
						}
					} catch (error) {
						console.error("Error parsing token:", error);
						// Clear invalid token
						localStorage.removeItem("accessToken");
						setUser(null);
						setIsAuthenticated(false);
					}
				} else {
					setIsAuthenticated(false);
				}
			} catch (error) {
				console.error("Error checking auth status:", error);
				setIsAuthenticated(false);
			} finally {
				setIsLoading(false);
			}
		};

		checkAuthStatus();
	}, []);

	const login = async (email: string, password: string): Promise<boolean> => {
		try {
			setIsLoading(true);
			const response = await authAPI.login({ email, password });

			const { user: userData, accessToken } = response.data;

			// Store only the access token, not the full user data
			localStorage.setItem("accessToken", accessToken);
			setUser(userData); // Keep user in state for current session only
			setIsAuthenticated(true);

			handleApiSuccess("Login successful!");
			return true;
		} catch (error) {
			handleApiError(error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const register = async (data: {
		username: string;
		email: string;
		fullName: string;
		password: string;
	}): Promise<boolean> => {
		try {
			setIsLoading(true);
			await authAPI.register(data);

			handleApiSuccess("Registration successful! Please log in.");
			return true;
		} catch (error) {
			handleApiError(error);
			return false;
		} finally {
			setIsLoading(false);
		}
	};

	const logout = () => {
		try {
			authAPI.logout().catch(() => {
				// Ignore errors on logout API call
			});
		} finally {
			// Clear local state regardless of API call success
			setUser(null);
			setIsAuthenticated(false);
			localStorage.removeItem("accessToken");
			router.push("/");
		}
	};

	const refreshUser = async () => {
		try {
			const token = localStorage.getItem("accessToken");
			if (token) {
				// You can implement an API call here to refresh user data if needed
				// For now, we'll just check if the token is valid
				const tokenPayload = JSON.parse(atob(token.split(".")[1]));
				const currentTime = Date.now() / 1000;

				if (tokenPayload.exp && tokenPayload.exp > currentTime) {
					// Token is valid, user is authenticated
					console.log("User refreshed successfully");
				} else {
					// Token expired
					localStorage.removeItem("accessToken");
					setUser(null);
				}
			}
		} catch (error) {
			console.error("Error refreshing user:", error);
			localStorage.removeItem("accessToken");
			setUser(null);
		}
	};

	const value = {
		user,
		isAuthenticated,
		isLoading,
		login,
		register,
		logout,
		refreshUser,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}

	return context;
};

// Higher-order component for protected routes
export const withAuth = (
	WrappedComponent: React.ComponentType,
	options: { title?: string } = {}
) => {
	return function AuthenticatedComponent(props: any) {
		const { isAuthenticated, isLoading } = useAuth();
		const router = useRouter();

		useEffect(() => {
			// Only redirect if we're not loading AND not authenticated
			if (!isLoading && !isAuthenticated) {
				router.push("/auth/login");
			}
		}, [isAuthenticated, isLoading, router]);

		// Show loading while checking authentication
		if (isLoading) {
			return (
				<Layout title={options.title || "Loading..."}>
					<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#BBE8E1] via-white to-[#F5CD6B]">
						<div className="text-center">
							<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#BBE8E1] mx-auto mb-4"></div>
							<p className="text-gray-600">
								Checking authentication...
							</p>
						</div>
					</div>
				</Layout>
			);
		}

		// Don't render anything while redirecting
		if (!isAuthenticated) {
			return null;
		}

		// Render the protected component only when authenticated
		return <WrappedComponent {...props} />;
	};
};
