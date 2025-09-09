// client/src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import Landing from './pages/Landing.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import InventoryView from './pages/InventoryView.jsx'; // ojo: extensión e import correctos
import ProtectedRoute from './components/ProtectedRoute.jsx';
import RegisterOwner from './pages/RegisterOwner.jsx';

// (opcional) si vas a usar luego:
// import Products from './pages/Products.jsx';
// import Quote from './pages/Quote.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';

import VentasPage from "./pages/VentasPage";

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Pública */}
          <Route path="/" element={<Landing />} />

          {/* Login admin */}
          <Route path="/login" element={<AdminLogin />} />
          <Route path="/registro" element={<RegisterOwner />} />
          <Route path='/dashboard' element={<AdminDashboard />} />
          <Route path="/ventas" element={<VentasPage />} />

          {/* Panel principal del admin: Inventario (PROTEGIDA) */}
          <Route
            path="/inventario"
            element={
              <ProtectedRoute>
                <InventoryView />
              </ProtectedRoute>
            }
          />

          {/* (Opcional, para después) */}
          {/* <Route path="/productos" element={<Products />} /> */}
          {/* <Route path="/cotizar" element={<Quote />} /> */}
          {/* <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} /> */}

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
