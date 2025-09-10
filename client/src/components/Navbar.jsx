
import { Link } from 'react-router-dom';
import { useState } from 'react';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem('token');

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('businessId');
    window.location.href = '/';
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-gray-800">
            Negocios Artesanales
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-gray-900">Inicio</Link>
            <Link to="/productos" className="text-gray-600 hover:text-gray-900">Productos</Link>
            <Link to="/cotizar" className="text-gray-600 hover:text-gray-900">Cotizar</Link>
            
            {token ? (
              <div className="flex items-center space-x-4">
                <Link to="/admin/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                  Mi Panel
                </Link>
                <button onClick={logout} className="text-gray-600 hover:text-gray-900">
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-gray-900">Ingresar</Link>
                <Link to="/registro" className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                  Registrar Negocio
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900">Inicio</Link>
              <Link to="/productos" className="text-gray-600 hover:text-gray-900">Productos</Link>
              <Link to="/cotizar" className="text-gray-600 hover:text-gray-900">Cotizar</Link>
              
              {token ? (
                <>
                  <Link to="/admin/dashboard" className="text-gray-600 hover:text-gray-900">Mi Panel</Link>
                  <button onClick={logout} className="text-left text-gray-600 hover:text-gray-900">
                    Cerrar Sesión
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900">Ingresar</Link>
                  <Link to="/registro" className="text-green-600 hover:text-green-700">Registrar Negocio</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}