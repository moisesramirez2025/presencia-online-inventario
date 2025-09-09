import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const businessName = localStorage.getItem('businessName') || '';

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  return (
    <header className="border-b">
      <nav className="max-w-5xl mx-auto p-4 flex items-center gap-4">
        {/* Logo / Home */}
        <Link to="/" className="font-bold text-lg">
          Mi App
        </Link>

        <div className="ml-auto flex items-center gap-3">
          {!token ? (
            <>
              <Link to="/login" className="text-sm underline">
                Login
              </Link>
              <Link
                to="/registro"
                className="text-sm bg-yellow-500 text-black px-2 py-1 rounded hover:bg-yellow-400"
              >
                Crear negocio
              </Link>
            </>
          ) : (
            <>
              {/* Nombre del negocio / estado de sesión */}
              <span className="text-xs sm:text-sm text-gray-600">
                {businessName ? `Negocio: ${businessName}` : 'Admin logueado'}
              </span>

              <Link to="/inventario" className="text-sm underline">
                Inventario
              </Link>

              <button
                onClick={logout}
                className="text-sm text-red-600 hover:underline"
              >
                Salir
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
