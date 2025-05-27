import React from 'react';
import { Navigate } from 'react-router-dom';

// roleRequired: string (e.g. 'organizer' or 'supplier')
// children: JSX to render if allowed
const ProtectedRoute = ({ roleRequired, children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.type) {
    // Not logged in
    return <Navigate to="/SignInPage" replace />;
  }
  if (
    (roleRequired === 'organizer' && user.type !== 'Event Planner') ||
    (roleRequired === 'supplier' && user.type !== 'Event Supplier')
  ) {
    // Wrong role, redirect to their homepage
    if (user.type === 'Event Planner') {
      return <Navigate to="/SuppliersPage" replace />;
    } else if (user.type === 'Event Supplier') {
      return <Navigate to="/SupplierHomepage" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }
  return children;
};

export default ProtectedRoute;
