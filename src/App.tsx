import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import AirportAssetsManagement from './pages/kitckensink';
// import AssetList from './components/AssetList';
// import AssetForm from './components/AssetForm';
// import Modal from './components/Modal';
// import { useAssets } from './hooks/useAssets';
import DashboardPage from './pages/DashboardPage';
import AssetsPage from './pages/AssetsPage';
// import LocationsPage from './pages/LocationsPage';
import AdminPage from './pages/AdminPage';
// import AssetDetailPage from './pages/AssetDetailPage';
import MainLayout from './components/layout/MainLayout/Mainlayout';
import { AuthProvider } from './features/auth/contexts/AuthContext';
import LoginPage from './features/auth/pages/LoginPage';
import ProtectedRoute from './features/auth/components/ProtectedRoute/ProtectedRoute';

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
            <Route path="/kitchensink" element={<AirportAssetsManagement />} />
            <Route path="/assets" element={<AssetsPage />} />
            {/* <Route path="/assets/:id" element={<AssetDetailPage />} /> */}
            <Route path="/admin" element={
              <ProtectedRoute requiredUserRole="admin">
                <AdminPage />
              </ProtectedRoute>
            } />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
