import { useState } from 'react';
import { api } from '../api';
import { useSearchParams } from 'react-router-dom';

export default function Quote() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    message: '',
    product: params.get('productId') || '',
    quantity: 1
  });
  const productTitle = params.get('productTitle');

  function onChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }
  async function submit(e) {
    e.preventDefault();
    const res = await api.post('/quotes', form);
    alert(res.data.message);
    setForm({ customerName: '', customerEmail: '', customerPhone: '', message: '', product: '', quantity: 1 });
  }

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Solicitar cotización</h1>
      {form.product && <div className="mb-4 text-sm">Producto seleccionado: <strong>{productTitle}</strong></div>}
      <form onSubmit={submit} className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Nombre*</label>
          <input className="input" name="customerName" value={form.customerName} onChange={onChange} required />
        </div>
        <div>
          <label className="label">Correo</label>
          <input className="input" name="customerEmail" type="email" value={form.customerEmail} onChange={onChange} />
        </div>
        <div>
          <label className="label">WhatsApp</label>
          <input className="input" name="customerPhone" placeholder="+57XXXXXXXXXX" value={form.customerPhone} onChange={onChange} />
        </div>
        <div>
          <label className="label">Cantidad</label>
          <input className="input" name="quantity" type="number" min="1" value={form.quantity} onChange={onChange} />
        </div>
        <div className="md:col-span-2">
          <label className="label">Mensaje / Detalles</label>
          <textarea className="input h-28" name="message" value={form.message} onChange={onChange} />
        </div>
        <div className="md:col-span-2">
          <button className="btn">Enviar cotización</button>
        </div>
      </form>
    </div>
  );
}
