import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../Pages/Loginpages';
import DashboardLayout from '../layout/dashboardlayout';
import DashboardPage from '../Pages/Dashboard';
import UserManagementPage from '../Pages/Usermanagement';
import BillsList from '../Pages/BillList';
import { useAuth } from '../context/Authcontext';
import CreateOrEditAdminPage from '../Pages/AdminPage';


// Page Components

// Protect routes based on auth
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/*"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <Routes>
                  {/* Both Owner and Admin can access dashboard + bills */}
                  <Route path="dashboard" element={<DashboardPage />} />
                  <Route path="bills" element={<BillsList/>} />
                  {/* Only Owners can access users */}
                  {user?.role === 'Owner' && (
                    <Route path="users" element={<UserManagementPage />} />
                    
                  )}
                  <Route path="users/create" element={<CreateOrEditAdminPage />} />
                  <Route path="users/edit/:id" element={<CreateOrEditAdminPage />} />


                  {/* Default/fallback routes */}
                  <Route path="/" element={<Navigate to="/dashboard" />} />
                  <Route path="*" element={<Navigate to="/dashboard" />} />
                </Routes>
              </DashboardLayout>
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};
export default AppRoutes;
