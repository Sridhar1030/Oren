import React from 'react';
import ProtectedRoute from './ProtectedRoute';

interface WithProtectedRouteOptions {
  title?: string;
  redirectTo?: string;
}

export function withProtectedRoute<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: WithProtectedRouteOptions = {}
) {
  const { title = "Protected Page", redirectTo = "/auth/login" } = options;

  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute title={title}>
        <WrappedComponent {...props} />
      </ProtectedRoute>
    );
  };
}

export default withProtectedRoute;
