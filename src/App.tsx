import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './features/assets/pages/AssetsPage';
import AdminPage from './features/auth/pages/AdminPage';
import NotFoundPage from './pages/NotFoundPage';
import MainLayout from './components/layout/MainLayout/Mainlayout';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import LoginPage from './features/auth/pages/LoginPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute/ProtectedRoute';
import { ToastContainer } from 'react-toastify';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/assets" element={<AssetsPage />} />
            {/* <Route path="/assets/:id" element={<AssetDetailPage />} /> */}
            <Route path="/admin" element={
              <ProtectedRoute requiredUserRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } />
          </Route>
          
          {/* 404 - Catch all unmatched routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
