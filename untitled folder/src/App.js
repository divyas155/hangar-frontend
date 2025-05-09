import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, GlobalStyles } from '@mui/material';
import theme from './theme';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import AuthCallback from './pages/AuthCallback';
import Welcome from './pages/Welcome';

// Dashboard / container components
import AdminDashboard from './pages/Admin/AdminDashboard';
import EngineerDashboard from './pages/Engineer/EngineerDashboard';
import PaymentAuthorityDashboard from './pages/PaymentAuthority/PaymentAuthorityDashboard';
import ViewerDashboard from './pages/Viewer/ViewerDashboard';

// Admin sub-pages
import UserManagement from './pages/Admin/UserManagement';
import ProgressApproval from './pages/Admin/ProgressApproval';
import PaymentApproval from './pages/Admin/PaymentApproval';
import Reports from './pages/Admin/Reports';

// ✅ Role form test page
import RoleFormTest from './pages/RoleFormTest';

function PrivateRoute({ children, allowedRoles }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
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

            {/* Protected routes with layout */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout />
                </PrivateRoute>
              }
            >
              {/* Welcome screen */}
              <Route index element={<Welcome />} />

              {/* ✅ Role test route inside layout and protected */}
              <Route
                path="role-test"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <RoleFormTest />
                  </PrivateRoute>
                }
              />

              {/* Admin dashboard & nested routes */}
              <Route
                path="admin"
                element={
                  <PrivateRoute allowedRoles={['admin']}>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              >
                <Route path="users" element={<UserManagement />} />
                <Route path="progress" element={<ProgressApproval />} />
                <Route path="payments" element={<PaymentApproval />} />
                <Route path="reports" element={<Reports />} />
              </Route>

              {/* Site Engineer dashboard */}
              <Route
                path="engineer/*"
                element={
                  <PrivateRoute allowedRoles={['engineer']}>
                    <EngineerDashboard />
                  </PrivateRoute>
                }
              />

              {/* Payment Authority dashboard */}
              <Route
                path="payment/*"
                element={
                  <PrivateRoute allowedRoles={['payment_authority']}>
                    <PaymentAuthorityDashboard />
                  </PrivateRoute>
                }
              />

              {/* Viewer dashboard */}
              <Route
                path="viewer/*"
                element={
                  <PrivateRoute allowedRoles={['viewer']}>
                    <ViewerDashboard />
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
