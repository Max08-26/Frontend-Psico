import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import MainLayout from './layouts/MainLayout';

import Landing from './pages/auth/Landing';
import Register from './pages/auth/Register';

import PatientDashboard from './pages/patient/PatientDashboard';
import Activities from './pages/patient/Activities';
import Medication from './pages/patient/Medication';
import Emotions from './pages/patient/Emotions';
import Emergency from './pages/patient/Emergency';
import TLPInfo from './pages/patient/TLPInfo';
import Profile from './pages/patient/Profile';
import Appointments from './pages/patient/Appointments';
import WeightTracking from './pages/patient/WeightTracking';

import HealthcareDashboard from './pages/healthcare/HealthcareDashboard';
import AssignActivities from './pages/healthcare/AssignActivities';
import PatientList from './pages/healthcare/PatientList';
import Ratings from './pages/healthcare/Ratings';
import Dashboards from './pages/healthcare/Dashboards';
import HealthcareProfile from './pages/healthcare/HealthcareProfile';
import AppointmentForm from './pages/healthcare/AppointmentForm';
import ManageActivities from './pages/healthcare/ManageActivities';

import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import Maintenance from './pages/admin/Maintenance';
import Updates from './pages/admin/Updates';
import FamilyDashboard from './pages/family/FamilyDashboard';

const ProtectedRoute = ({ children, allowedType }) => {
  const { user, userType, loading } = useAuth();
  const { isDark } = useTheme();

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
        isDark
          ? 'bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800'
          : 'bg-gradient-to-br from-blue-50 via-white to-blue-50'
      }`}>
        <div className={`text-xl font-semibold ${isDark ? 'text-white' : 'text-gray-800'}`}>Cargando...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (allowedType && userType !== allowedType) {
    if (userType === 'patient') return <Navigate to="/patient/dashboard" replace />;
    if (userType === 'healthcare') return <Navigate to="/healthcare/dashboard" replace />;
    if (userType === 'familiar') return <Navigate to="/familiar/dashboard" replace />;
    if (userType === 'admin') return <Navigate to="/admin/dashboard" replace />;
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedType="patient">
                  <PatientDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/activities"
              element={
                <ProtectedRoute allowedType="patient">
                  <Activities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/medication"
              element={
                <ProtectedRoute allowedType="patient">
                  <Medication />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/emotions"
              element={
                <ProtectedRoute allowedType="patient">
                  <Emotions />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/emergency"
              element={
                <ProtectedRoute allowedType="patient">
                  <Emergency />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/tlp-info"
              element={
                <ProtectedRoute allowedType="patient">
                  <TLPInfo />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/profile"
              element={
                <ProtectedRoute allowedType="patient">
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/appointments"
              element={
                <ProtectedRoute allowedType="patient">
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/weight-tracking"
              element={
                <ProtectedRoute allowedType="patient">
                  <WeightTracking />
                </ProtectedRoute>
              }
            />

            <Route
              path="/familiar/dashboard"
              element={
                <ProtectedRoute allowedType="familiar">
                  <FamilyDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/familiar/tlp-info"
              element={
                <ProtectedRoute allowedType="familiar">
                  <TLPInfo />
                </ProtectedRoute>
              }
            />

            <Route
              path="/healthcare/dashboard"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <HealthcareDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/assign-activities"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <AssignActivities />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/patients"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <PatientList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/ratings"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <Ratings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/dashboards"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <Dashboards />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/profile"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <HealthcareProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/appointments"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <Appointments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/appointments/new"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/appointments/edit/:id"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <AppointmentForm />
                </ProtectedRoute>
              }
            />
            <Route
              path="/healthcare/manage-activities"
              element={
                <ProtectedRoute allowedType="healthcare">
                  <ManageActivities />
                </ProtectedRoute>
              }
            />

            <Route path="/admin/users" element={<ProtectedRoute allowedType="admin"><UserManagement /></ProtectedRoute>} />
            <Route path="/admin/maintenance" element={<ProtectedRoute allowedType="admin"><Maintenance /></ProtectedRoute>} />
            <Route path="/admin/updates" element={<ProtectedRoute allowedType="admin"><Updates /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Router>
        </AuthProvider>
      </ThemeProvider>
    );
  }

export default App;

