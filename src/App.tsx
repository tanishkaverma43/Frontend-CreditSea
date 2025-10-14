import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/UserContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginForm from './components/auth/LoginForm';
import RegistrationForm from './components/auth/RegistrationForm';
import MainDashboard from './pages/MainDashboard';
import UserDashboard from './pages/UserDashboard';
import './App.css';

const RoleBasedDashboard = () => {
  const { user } = useAuth();
  
  if (user?.role === 'borrower') {
    return <UserDashboard />;
  }
  
  return <MainDashboard />;
};

function App() {
    return (
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegistrationForm />} />
            
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <RoleBasedDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user-dashboard" 
              element={
                <ProtectedRoute>
                  <UserDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/borrowers" 
              element={
                <ProtectedRoute>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/loans" 
              element={
                <ProtectedRoute>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/repayments" 
              element={
                <ProtectedRoute>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/loan-parameters" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/accounting" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/reports" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/collateral" 
              element={
                <ProtectedRoute>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/access-config" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/savings" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/other-incomes" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payroll" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/expenses" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/e-signature" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/investor-accounts" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute allowedRoles={['admin', 'verifier']}>
                  <MainDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
