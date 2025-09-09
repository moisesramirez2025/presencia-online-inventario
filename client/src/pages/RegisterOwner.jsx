import { useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

export default function RegisterOwner() {
  const [form, setForm] = useState({
    businessName: '',
    contactEmail: '',
    phone: '',
    address: '',
    name: '',
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const { data } = await api.post('/auth/admin/register-owner', form);
      localStorage.setItem('token', data.token);
      localStorage.setItem('businessId', data.business.id || data.business._id || '');
      localStorage.setItem('businessName', data.business.name || '');
      localStorage.setItem('adminName', data.admin.name || '');
      navigate('/inventario');
    } catch (err) {
      alert(err.response?.data?.message || 'Error registrando');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto p-6 space-y-3">
      <h2 className="text-xl font-semibold mb-2">Crear negocio</h2>
      <input className="w-full border rounded px-3 py-2" name="businessName" placeholder="Nombre del negocio" onChange={onChange} required />
      <input className="w-full border rounded px-3 py-2" name="contactEmail" placeholder="Correo de contacto (opcional)" onChange={onChange} />
      <input className="w-full border rounded px-3 py-2" name="phone" placeholder="Teléfono (opcional)" onChange={onChange} />
      <input className="w-full border rounded px-3 py-2" name="address" placeholder="Dirección (opcional)" onChange={onChange} />
      <hr />
      <input className="w-full border rounded px-3 py-2" name="name" placeholder="Tu nombre" onChange={onChange} required />
      <input className="w-full border rounded px-3 py-2" name="email" type="email" placeholder="Tu correo" onChange={onChange} required />
      <input className="w-full border rounded px-3 py-2" name="password" type="password" placeholder="Contraseña" onChange={onChange} required />
      <button className="w-full bg-black text-white rounded py-2" disabled={loading}>
        {loading ? 'Creando…' : 'Crear negocio'}
      </button>
    </form>
  );
}
