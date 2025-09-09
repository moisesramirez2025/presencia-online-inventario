import { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@tienda.com');
  const [password, setPassword] = useState('admin123');
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      navigate('/admin');
    } catch (e) {
      alert(e.response?.data?.message || 'Error de login');
    }
  }
  return (
    <div className="container py-10">
      <h1 className="text-2xl font-semibold mb-4">Ingreso administrador</h1>
      <form onSubmit={submit} className="max-w-md card">
        <label className="label">Correo</label>
        <input className="input mb-3" value={email} onChange={e => setEmail(e.target.value)} />
        <label className="label">Contraseña</label>
        <input className="input mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="btn w-full">Entrar</button>
      </form>
    </div>
  );
}
