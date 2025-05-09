import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Welcome from './pages/Welcome';

// Dashboards
import AdminDashboard from './pages/Admin/AdminDashboard';
import EngineerDashboard from './pages/Engineer/EngineerDashboard';
import PaymentAuthorityDashboard from './pages/PaymentAuthority/PaymentAuthorityDashboard';
import ViewerDashboard from './pages/Viewer/ViewerDashboard';

// Admin sub-pages
import UserManagement from './pages/Admin/UserManagement';
import ProgressApproval from './pages/Admin/ProgressApproval';
import PaymentApproval from './pages/Admin/PaymentApproval';
import Reports from './pages/Admin/Reports';

// Site Engineer sub-pages
import UploadProgress from './pages/Engineer/UploadProgress';
import ViewProgress from './pages/Engineer/ViewProgress';

// Payment Authority sub-pages
import UpdatePayment from './pages/PaymentAuthority/UpdatePayment';
import ViewPayments from './pages/PaymentAuthority/ViewPayments';

// Viewer sub-pages
import ViewProgressViewer from './pages/Viewer/ViewProgressViewer';
import ViewPaymentViewer from './pages/Viewer/ViewPaymentViewer';

import RoleFormTest from './pages/RoleFormTest';

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GlobalStyles
        styles={{
          'html, body, #root': {
            height: '100%',
            overflow: 'visible',
            position: 'relative',
            zIndex: 1,
          },
          '.MuiPopover-root, .MuiModal-root, .MuiPaper-root': {
            zIndex: 3000,
          },
        }}
      />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Protected layout wrapper */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              <Route index element={<Welcome />} />

              {/* Admin routes */}
              <Route
                path="admin"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <Outlet />
                  </PrivateRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
                <Route path="user-management" element={<UserManagement />} />
                <Route path="payment-approval" element={<PaymentApproval />} /> {/* ✅ Updated route path */}
                <Route path="progress-approval" element={<ProgressApproval />} />
                <Route path="reports" element={<Reports />} />
                <Route path="reports/payments" element={<Reports />} />
              </Route>

              {/* Site Engineer routes */}
              <Route
                path="engineer"
                element={
                  <PrivateRoute allowedRoles={['site_engineer']}>
                    <Outlet />
                  </PrivateRoute>
                }
              >
                <Route index element={<EngineerDashboard />} />
                <Route path="upload" element={<UploadProgress />} />
                <Route path="view" element={<ViewProgress />} />
              </Route>

              {/* Payment Authority routes */}
              <Route
                path="payment"
                element={
                  <PrivateRoute allowedRoles={['paying_authority']}>
                    <Outlet />
                  </PrivateRoute>
                }
              >
                <Route index element={<PaymentAuthorityDashboard />} />
                <Route path="submit" element={<UpdatePayment />} />
                <Route path="view" element={<ViewPayments />} />
              </Route>

              {/* Viewer routes */}
              <Route
                path="viewer"
                element={
                  <PrivateRoute allowedRoles={['viewer']}>
                    <Outlet />
                  </PrivateRoute>
                }
              >
                <Route index element={<ViewerDashboard />} />
                <Route path="progress" element={<ViewProgressViewer />} />
                <Route path="payments" element={<ViewPaymentViewer />} />
              </Route>

              {/* Test route */}
              <Route
                path="role-test"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <RoleFormTest />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
