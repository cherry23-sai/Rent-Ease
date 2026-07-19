import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './components/ui.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProductsBrowsePage from './pages/ProductsBrowsePage';
import MyProductsPage from './pages/MyProductsPage';
import ProductFormPage from './pages/ProductFormPage';
import MyOrdersPage from './pages/MyOrdersPage';
import IncomingOrdersPage from './pages/IncomingOrdersPage';
import ProfilePage from './pages/ProfilePage';
import AdminApprovalsPage from './pages/AdminApprovalsPage';
import AdminReportsPage from './pages/AdminReportsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />

          <Route path="/products" element={
            <ProtectedRoute roles={['USER']}><ProductsBrowsePage /></ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute roles={['USER']}><MyOrdersPage /></ProtectedRoute>
          } />

          <Route path="/my-products" element={
            <ProtectedRoute roles={['CLIENT']}><MyProductsPage /></ProtectedRoute>
          } />
          <Route path="/my-products/new" element={
            <ProtectedRoute roles={['CLIENT']}><ProductFormPage /></ProtectedRoute>
          } />
          <Route path="/my-products/:id/edit" element={
            <ProtectedRoute roles={['CLIENT']}><ProductFormPage /></ProtectedRoute>
          } />
          <Route path="/incoming-orders" element={
            <ProtectedRoute roles={['CLIENT']}><IncomingOrdersPage /></ProtectedRoute>
          } />

          <Route path="/admin/approvals" element={
            <ProtectedRoute roles={['SUPER_ADMIN']}><AdminApprovalsPage /></ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute roles={['SUPER_ADMIN']}><AdminReportsPage /></ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute><ProfilePage /></ProtectedRoute>
          } />

          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
