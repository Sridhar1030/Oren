import React from 'react';
import { withAuth, useAuth } from '@/hooks/useAuth';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout/Layout';

// Example 1: Using withAuth HOC (Recommended for simple cases)
const SimpleProtectedPage = () => {
  return (
    <Layout title="Simple Protected Page">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Simple Protected Page</h1>
        <p>This page is protected using the withAuth HOC.</p>
      </div>
    </Layout>
  );
};

// Example 2: Using ProtectedRoute component (More flexible)
const FlexibleProtectedPage = () => {
  return (
    <Layout title="Flexible Protected Page">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Flexible Protected Page</h1>
        <p>This page is protected using the ProtectedRoute component.</p>
      </div>
    </Layout>
  );
};

// Example 3: Conditional rendering based on auth state
const ConditionalProtectedPage = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return (
      <Layout title="Access Denied">
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Access Denied</h1>
          <p>Please log in to access this page.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Conditional Protected Page">
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user?.fullName}!</h1>
        <p>This page shows conditional content based on authentication.</p>
      </div>
    </Layout>
  );
};

// Export the HOC-wrapped version
export const SimpleProtectedPageWithAuth = withAuth(SimpleProtectedPage, { 
  title: "Simple Protected Page" 
});

// Export the component-wrapped version
export const FlexibleProtectedPageWithRoute = () => (
  <ProtectedRoute title="Flexible Protected Page">
    <FlexibleProtectedPage />
  </ProtectedRoute>
);

// Export the conditional version
export const ConditionalProtectedPageComponent = ConditionalProtectedPage;

export default SimpleProtectedPageWithAuth;
