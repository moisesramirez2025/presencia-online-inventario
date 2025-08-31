import { Link, useNavigate } from 'react-router-dom';
export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  function logout() {
    localStorage.removeItem('token');
    navigate('/');
  }
  return (
    <header className="bg-white border-b">
      <div className="container py-3 flex items-center justify-between">
        <Link to="/" className="font-bold text-xl">TuForma</Link>
        <nav className="flex items-center gap-4">
          <Link to="/productos">Productos</Link>
          <Link className="btn" to="/cotizar">Solicitar cotización</Link>
          {token ? (<><Link to="/admin">Panel</Link><button className="text-sm underline" onClick={logout}>Salir</button></>) : (<Link to="/admin/login">Admin</Link>)}
        </nav>
      </div>
    </header>
  );
}
