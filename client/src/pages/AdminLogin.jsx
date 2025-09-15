// client/src/pages/AdminLogin.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/auth/admin/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('businessId', data.business.id);
      localStorage.setItem('businessName', data.business.name);
      localStorage.setItem('adminName', data.admin.name);
      navigate('/inventario');
    } catch (err) {
      alert(err.response?.data?.message || 'Error de login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto p-6">
      <h2 className="text-xl font-semibold mb-4">Iniciar sesión (Administrador)</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2"
                 value={email} onChange={e=>setEmail(e.target.value)} type="email" required/>
        </div>
        <div>
          <label className="block text-sm mb-1">Contraseña</label>
          <input className="w-full border rounded px-3 py-2"
                 value={password} onChange={e=>setPassword(e.target.value)} type="password" required/>
        </div>
        <button className="w-full bg-black text-white rounded py-2" disabled={loading}>
          {loading ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}
