import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import Products from './pages/Products.jsx';
import Quote from './pages/Quote.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import RegisterOwner from './pages/RegisterOwner.jsx';
import InventoryView from './pages/InventoryView.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import VentasPage from "./pages/VentasPage";
import ProtectedRoute from './components/ProtectedRoute.jsx';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* ================== RUTAS PÚBLICAS ================== */}
          <Route path="/" element={<Landing />} />
          <Route path="/productos" element={<Products />} />
          <Route path="/cotizar" element={<Quote />} />
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/registro" element={<RegisterOwner />} />

          {/* ================== RUTAS PROTEGIDAS (Admin) ================== */}
          <Route path="/admin/inventario" element={
            <ProtectedRoute>
              <InventoryView />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/dashboard" element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/admin/ventas" element={
            <ProtectedRoute>
              <VentasPage />
            </ProtectedRoute>
          } />

          {/* ================== REDIRECCIONES ================== */}
          <Route path="/inventario" element={<Navigate to="/admin/inventario" replace />} />
          <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/ventas" element={<Navigate to="/admin/ventas" replace />} />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}