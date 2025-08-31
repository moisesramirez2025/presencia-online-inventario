import { useEffect, useState } from 'react';
import { api } from '../api';

function ProductsTab() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ title: '', description: '', price: 0, images: '', category: '' });
  
  // Ventana de actualizar producto
  const [showModal, setShowModal] = useState(false); // Para mostrar/ocultar el modal
  const [selectedProduct, setSelectedProduct] = useState(null); // Para guardar el producto a editar
  const [editForm, setEditForm] = useState({ title: '', description: '', price: 0, images: '', category: '', cant: 0 }); // Para el formulario de edición
  
  





  // funciones ventana actualizar
function onEditChange(e) {
  const { name, value } = e.target;
  setEditForm(f => ({ ...f, [name]: value }));
  
}
async function handleUpdate(e) {
  e.preventDefault();
  if (!selectedProduct) return;
  await api.put(`/products/admin/${selectedProduct._id}`, {
    ...editForm,
    price: Number(editForm.price),
    images: editForm.images.split(',').map(s => s.trim()).filter(Boolean)
  });
  setShowModal(false);
  setSelectedProduct(null);
  load(); // Recargar la lista de productos
}










  
  function load() { api.get('/products/admin').then(res => setItems(res.data)); }
  useEffect(load, []);
  function onChange(e) { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); }
  async function create(e) {
    e.preventDefault();
    const payload = { ...form, price: Number(form.price), images: form.images.split(',').map(s => s.trim()).filter(Boolean) };
    await api.post('/products/admin', payload);
    setForm({ title: '', description: '', price: 0, images: '', category: '' });
    load();
  }
  async function toggleActive(p) { await api.put(`/products/admin/${p._id}`, { isActive: !p.isActive }); load(); }
  async function remove(id) { if (!confirm('¿Eliminar producto?')) return; await api.delete(`/products/admin/${id}`); load(); }
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <form onSubmit={create} className="card">
        <h3 className="font-semibold mb-3">Nuevo producto</h3>
        <input className="input mb-2" name="title" placeholder="Título" value={form.title} onChange={onChange} required />
        <textarea className="input mb-2 h-24" name="description" placeholder="Descripción" value={form.description} onChange={onChange} />
        <input className="input mb-2" name="price" type="number" step="0.01" placeholder="Precio" value={form.price} onChange={onChange} required />
        <input className="input mb-2" name="images" placeholder="URLs de imágenes (coma separadas)" value={form.images} onChange={onChange} />
        <input className="input mb-4" name="category" placeholder="Categoría" value={form.category} onChange={onChange} />
        <input className="input mb-2" name="cant" type="number" step="1" placeholder="Cantidad" value={form.cant} onChange={onChange} />
        <button className="btn">Crear</button>
      </form>
      <div className="card">
        <h3 className="font-semibold mb-3">Listado</h3>
        <div className="space-y-3 max-h-[460px] overflow-auto pr-2">
          {items.map(p => (
            <div key={p._id} className="border rounded p-3 flex items-center justify-between">
              <div className="text-sm">
                <div className=""> <img src={p.images} alt="" /> </div>
                <div className="font-semibold">{p.title}</div>
                <div className="text-gray-600">${p.price?.toLocaleString()} — {p.isActive ? 'Activo' : 'Inactivo'} — Disponibles:{p.cant?.toLocaleString()}</div>
              </div>
              <div className="flex gap-2">

              {/* abrir ventana de actualizar */}

                <button className="btn bg-blue-600" onClick={() => {
                  setSelectedProduct(p);
                  setEditForm({
                    title: p.title,
                    description: p.description,
                    price: p.price,
                    images: p.images.join(', '),
                    category: p.category,
                    cant: p.cant
                  });
                  setShowModal(true);
                }}>Editar</button>
                
                {showModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-lg min-w-[320px] relative">
      <button
        className="absolute top-2 right-2 text-xl"
        onClick={() => setShowModal(false)}
      >
        &times;
      </button>
      <h2 className="text-lg font-bold mb-2">Editar producto</h2>
      <form onSubmit={handleUpdate}>
        <input className="input mb-2" name="title" placeholder="Título" value={editForm.title} onChange={onEditChange} required />
        <textarea className="input mb-2 h-20" name="description" placeholder="Descripción" value={editForm.description} onChange={onEditChange} />
        <input className="input mb-2" name="price" type="number" step="0.01" placeholder="Precio" value={editForm.price} onChange={onEditChange} required />
        <input className="input mb-2" name="images" placeholder="URLs de imágenes (coma separadas)" value={editForm.images} onChange={onEditChange} />
        <input className="input mb-2" name="category" placeholder="Categoría" value={editForm.category} onChange={onEditChange} />
        <input className="input mb-2" name="cant" type="number" step="1" placeholder="Cantidad" value={editForm.cant} onChange={onEditChange} />
        <div className="flex gap-2 mt-3">
          <button className="btn" type="submit">Guardar cambios</button>
          <button className="btn bg-gray-400" type="button" onClick={() => setShowModal(false)}>Cancelar</button>
        </div>
      </form>
    </div>
  </div>
)}








                <button className="btn" onClick={() => toggleActive(p)}>{p.isActive ? 'Desactivar' : 'Activar'}</button>
                <button className="btn bg-red-600" onClick={() => remove(p._id)}>Eliminar</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuotesTab() {
  const [items, setItems] = useState([]);
  function load() { api.get('/quotes/admin').then(res => setItems(res.data)); }
  useEffect(load, []);
  function waLink(phone, text) {
    const p = (phone || '').replace(/[^\d+]/g, '');
    const msg = encodeURIComponent(text || 'Hola, sobre tu cotización...');
    return `https://wa.me/${p}?text=${msg}`;
  }
  function mailLink(email, subject, body) {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }
  async function setStatus(id, status) { await api.put(`/quotes/admin/${id}/status`, { status }); load(); }
  return (
    <div className="card">
      <h3 className="font-semibold mb-3">Cotizaciones</h3>
      <div className="space-y-3">
        {items.map(q => (
          <div key={q._id} className="border rounded p-3">
            <div className="text-sm flex justify-between">
              <div>
                <div className="font-semibold">{q.customerName}</div>
                <div>{q.customerEmail} {q.customerPhone ? `— ${q.customerPhone}` : ''}</div>
              </div>
              <div className="text-xs text-gray-500">{new Date(q.createdAt).toLocaleString()}</div>
            </div>
            {q.product && <div className="mt-1 text-sm">Producto: <strong>{q.product.title}</strong> (x{q.quantity})</div>}
            {q.message && <p className="mt-1 text-sm">{q.message}</p>}
            <div className="mt-3 flex gap-2">
              {q.customerPhone && <a className="btn" target="_blank" rel="noreferrer" href={waLink(q.customerPhone, 'Hola, recibimos tu solicitud de cotización.')}>WhatsApp</a>}
              {q.customerEmail && <a className="btn" href={mailLink(q.customerEmail, 'Cotización Carpintería', 'Hola, recibimos tu solicitud de cotización.')}>Email</a>}
              <select className="input max-w-[160px]" value={q.status} onChange={e => setStatus(q._id, e.target.value)}>
                <option value="nueva">nueva</option>
                <option value="en_proceso">en_proceso</option>
                <option value="cerrada">cerrada</option>
              </select>
            </div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-gray-500">No hay cotizaciones todavía.</div>}
      </div>
    </div>
  );
}










function SettingsTab() {
  const [form, setForm] = useState({ bannerImageUrl: '', heroTitle: '', heroSubtitle: '' });
  const [loaded, setLoaded] = useState(False => false);

  // Fix potential typo introducing default false:
  useEffect(() => { api.get('/settings').then(r => { setForm(r.data); setLoaded(true); }); }, []);

  function onChange(e) { const { name, value } = e.target; setForm(f => ({ ...f, [name]: value })); }
  async function save(e) { e.preventDefault(); await api.put('/settings/admin', form); alert('Guardado'); }
  if (!loaded) return null;
  return (
    <form onSubmit={save} className="card">
      <h3 className="font-semibold mb-3">Landing / Banner</h3>
      <label className="label">URL de imagen del banner</label>
      <input className="input mb-3" name="bannerImageUrl" value={form.bannerImageUrl || ''} onChange={onChange} />
      <label className="label">Título</label>
      <input className="input mb-3" name="heroTitle" value={form.heroTitle || ''} onChange={onChange} />
      <label className="label">Subtítulo</label>
      <input className="input mb-4" name="heroSubtitle" value={form.heroSubtitle || ''} onChange={onChange} />
      <button className="btn">Guardar cambios</button>
    </form>
  );
}

export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Panel administrador</h1>
      <div className="flex gap-2 mb-4">
        <button className={`btn ${tab==='products'?'':'bg-gray-800'}`} onClick={() => setTab('products')}>Productos</button>
        <button className={`btn ${tab==='quotes'?'':'bg-gray-800'}`} onClick={() => setTab('quotes')}>Cotizaciones</button>
        <button className={`btn ${tab==='settings'?'':'bg-gray-800'}`} onClick={() => setTab('settings')}>Configuración</button>
      </div>
      {tab === 'products' && <ProductsTab />}
      {tab === 'quotes' && <QuotesTab />}
      {tab === 'settings' && <SettingsTab />}
    </div>
  );
}
