import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";
import Layout from "./Layout/Layout";

interface ProtectedRouteProps {
	children: React.ReactNode;
	title?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
	children,
	title = "Protected Page",
}) => {
	const { isAuthenticated, isLoading } = useAuth();
	const router = useRouter();
	const [isChecking, setIsChecking] = useState(true);
	const [hasInitialized, setHasInitialized] = useState(false);

	useEffect(() => {
		// Add a small delay to prevent immediate redirects during initial load
		const timer = setTimeout(() => {
			setHasInitialized(true);
		}, 100);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		// Only proceed if we've initialized and we're not loading
		if (hasInitialized && !isLoading) {
			if (!isAuthenticated) {
				// Redirect to login if not authenticated
				router.push("/auth/login");
			} else {
				// User is authenticated, stop checking
				setIsChecking(false);
			}
		}
	}, [hasInitialized, isAuthenticated, isLoading, router]);

	// Show loading while checking authentication or initializing
	if (isLoading || isChecking || !hasInitialized) {
		return (
			<Layout title={title}>
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

	// Show children if authenticated
	if (isAuthenticated) {
		return <>{children}</>;
	}

	// This should never be reached, but just in case
	return null;
};

export default ProtectedRoute;
