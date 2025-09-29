import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminProtectedRoute from '@/components/admin/AdminProtectedRoute';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

const AdminPage: React.FC = () => {
  const { isAuthenticated, isLoading } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route 
        path="/login" 
        element={isAuthenticated ? <Navigate to="/admin/dashboard" replace /> : <AdminLoginForm />} 
      />
      <Route 
        path="/dashboard" 
        element={
          <AdminProtectedRoute>
            <AdminDashboard />
          </AdminProtectedRoute>
        } 
      />
      <Route 
        path="/" 
        element={<Navigate to={isAuthenticated ? "/admin/dashboard" : "/admin/login"} replace />} 
      />
    </Routes>
  );
};

export default AdminPage;
