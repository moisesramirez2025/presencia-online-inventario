import { useEffect, useState } from 'react';
import { api } from '../api';
import { useNavigate } from 'react-router-dom';

// Componente para la pestaña de Productos
function ProductsTab() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ 
    title: '', 
    description: '', 
    price: 0, 
    images: '', 
    category: '', 
    cant: 0 
  });

  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editForm, setEditForm] = useState({ 
    title: '', 
    description: '', 
    price: 0, 
    images: '', 
    category: '', 
    cant: 0 
  });

  const token = localStorage.getItem('token');

  // Cargar productos
  const loadProducts = async () => {
    if (!token) {
      alert('No autenticado. Redirigiendo al login...');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);
      const res = await api.get('/products/admin');
      setItems(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Error loading products:', error);
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Handlers para formularios
  const handleFormChange = (e, isEdit = false) => {
    const { name, value } = e.target;
    const setter = isEdit ? setEditForm : setForm;
    setter(prev => ({ 
      ...prev, 
      [name]: name === 'price' || name === 'cant' ? Number(value) : value 
    }));
  };

  // Crear producto
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert('No autenticado');
      return;
    }

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        cant: Number(form.cant),
        images: form.images 
          ? form.images.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };

      await api.post('/products/admin', payload);
      
      // Reset form and reload
      setForm({ title: '', description: '', price: 0, images: '', category: '', cant: 0 });
      await loadProducts();
      alert('Producto creado exitosamente');
    } catch (error) {
      console.error('Error creating product:', error);
      alert(error.response?.data?.message || 'Error creando producto');
    }
  };

  // Actualizar producto
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!selectedProduct || !token) {
      alert('Error de autenticación');
      return;
    }

    try {
      const payload = {
        ...editForm,
        price: Number(editForm.price),
        cant: Number(editForm.cant),
        images: editForm.images 
          ? editForm.images.split(',').map(s => s.trim()).filter(Boolean)
          : []
      };

      await api.put(`/products/admin/${selectedProduct._id}`, payload);
      
      setShowModal(false);
      setSelectedProduct(null);
      await loadProducts();
      alert('Producto actualizado exitosamente');
    } catch (error) {
      console.error('Error updating product:', error);
      alert(error.response?.data?.message || 'Error actualizando producto');
    }
  };

  // Toggle activo/inactivo
  const toggleActive = async (product) => {
    if (!token) {
      alert('No autenticado');
      return;
    }

    try {
      await api.put(`/products/admin/${product._id}`, { 
        isActive: !product.isActive 
      });
      await loadProducts();
    } catch (error) {
      console.error('Error toggling product:', error);
      alert('Error cambiando estado del producto');
    }
  };

  // Eliminar producto
  const removeProduct = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    if (!token) {
      alert('No autenticado');
      return;
    }

    try {
      await api.delete(`/products/admin/${id}`);
      await loadProducts();
      alert('Producto eliminado');
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Error eliminando producto');
    }
  };

  // Abrir modal de edición
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setEditForm({
      title: product.title || '',
      description: product.description || '',
      price: product.price || 0,
      images: Array.isArray(product.images) ? product.images.join(', ') : (product.images || ''),
      category: product.category || '',
      cant: product.cant || 0
    });
    setShowModal(true);
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Formulario de creación */}
      <form onSubmit={handleCreate} className="card p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-3">Nuevo Producto</h3>
        
        <div className="space-y-3">
          <input 
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="title" 
            placeholder="Título *" 
            value={form.title} 
            onChange={(e) => handleFormChange(e, false)}
            required 
          />
          
          <textarea 
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 h-20"
            name="description" 
            placeholder="Descripción" 
            value={form.description} 
            onChange={(e) => handleFormChange(e, false)}
          />
          
          <input 
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="price" 
            type="number" 
            step="0.01" 
            placeholder="Precio *" 
            value={form.price} 
            onChange={(e) => handleFormChange(e, false)}
            required 
          />
          
          <input 
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="images" 
            placeholder="URLs de imágenes (separadas por coma)" 
            value={form.images} 
            onChange={(e) => handleFormChange(e, false)}
          />
          
          <input 
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="category" 
            placeholder="Categoría" 
            value={form.category} 
            onChange={(e) => handleFormChange(e, false)}
          />
          
          <input 
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            name="cant" 
            type="number" 
            step="1" 
            placeholder="Cantidad en stock" 
            value={form.cant} 
            onChange={(e) => handleFormChange(e, false)}
          />
          
          <button 
            type="submit" 
            className="w-full bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Crear Producto
          </button>
        </div>
      </form>

      {/* Lista de productos */}
      <div className="card p-4 bg-white rounded-lg shadow">
        <h3 className="font-semibold text-lg mb-3">Productos ({items.length})</h3>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando productos...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No hay productos. Crea el primero.
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {items.map(product => (
              <div key={product._id} className="border rounded p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <img
                    src={Array.isArray(product.images) && product.images[0] 
                      ? product.images[0] 
                      : 'https://via.placeholder.com/60x60?text=📦'
                    }
                    alt={product.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm truncate">{product.title}</h4>
                    <p className="text-xs text-gray-600">
                      ${Number(product.price || 0).toLocaleString()} • 
                      Stock: {Number(product.cant || 0)} • 
                      <span className={product.isActive ? 'text-green-600' : 'text-red-600'}>
                        {product.isActive ? ' Activo' : ' Inactivo'}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(product)}
                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => toggleActive(product)}
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded hover:bg-yellow-700"
                  >
                    {product.isActive ? 'Desact' : 'Activar'}
                  </button>
                  <button
                    onClick={() => removeProduct(product._id)}
                    className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de edición */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>

              <h2 className="text-xl font-bold mb-4">Editar Producto</h2>
              
              <form onSubmit={handleUpdate} className="space-y-3">
                <input 
                  className="w-full border rounded px-3 py-2"
                  name="title" 
                  placeholder="Título" 
                  value={editForm.title} 
                  onChange={(e) => handleFormChange(e, true)}
                  required 
                />
                
                <textarea 
                  className="w-full border rounded px-3 py-2 h-20"
                  name="description" 
                  placeholder="Descripción" 
                  value={editForm.description} 
                  onChange={(e) => handleFormChange(e, true)}
                />
                
                <input 
                  className="w-full border rounded px-3 py-2"
                  name="price" 
                  type="number" 
                  step="0.01" 
                  placeholder="Precio" 
                  value={editForm.price} 
                  onChange={(e) => handleFormChange(e, true)}
                  required 
                />
                
                <input 
                  className="w-full border rounded px-3 py-2"
                  name="images" 
                  placeholder="URLs de imágenes (separadas por coma)" 
                  value={editForm.images} 
                  onChange={(e) => handleFormChange(e, true)}
                />
                
                <input 
                  className="w-full border rounded px-3 py-2"
                  name="category" 
                  placeholder="Categoría" 
                  value={editForm.category} 
                  onChange={(e) => handleFormChange(e, true)}
                />
                
                <input 
                  className="w-full border rounded px-3 py-2"
                  name="cant" 
                  type="number" 
                  step="1" 
                  placeholder="Cantidad" 
                  value={editForm.cant} 
                  onChange={(e) => handleFormChange(e, true)}
                />
                
                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Guardar
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Componente para la pestaña de Cotizaciones (corregido)
function QuotesTab() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadQuotes = async () => {
    try {
      setLoading(true);
      const res = await api.get('/quotes/admin');
      setItems(res.data?.data || res.data || []);
    } catch (error) {
      console.error('Error loading quotes:', error);
      alert('Error cargando cotizaciones');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuotes();
  }, []);

  const setStatus = async (id, status) => {
    try {
      await api.put(`/quotes/admin/${id}/status`, { status });
      await loadQuotes();
    } catch (error) {
      console.error('Error updating quote status:', error);
      alert('Error actualizando estado');
    }
  };

  const waLink = (phone, text) => {
    const cleanedPhone = (phone || '').replace(/[^\d+]/g, '');
    const message = encodeURIComponent(text || 'Hola, sobre tu cotización...');
    return `https://wa.me/${cleanedPhone}?text=${message}`;
  };

  const mailLink = (email, subject, body) => {
    return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="card p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Cotizaciones ({items.length})</h3>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Cargando cotizaciones...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No hay cotizaciones pendientes.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map(quote => (
            <div key={quote._id} className="border rounded p-4">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h4 className="font-semibold">{quote.customerName}</h4>
                  <p className="text-sm text-gray-600">
                    {quote.customerEmail && `${quote.customerEmail} • `}
                    {quote.customerPhone}
                  </p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(quote.createdAt).toLocaleDateString()}
                </span>
              </div>

              {quote.product && (
                <p className="text-sm mb-2">
                  <strong>Producto:</strong> {quote.product.title} 
                  {quote.quantity && ` (x${quote.quantity})`}
                </p>
              )}

              {quote.message && (
                <p className="text-sm text-gray-700 mb-3 border-l-2 border-gray-300 pl-2">
                  {quote.message}
                </p>
              )}

              <div className="flex flex-wrap gap-2 items-center">
                {quote.customerPhone && (
                  <a
                    href={waLink(quote.customerPhone, 'Hola, sobre tu cotización...')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    WhatsApp
                  </a>
                )}
                
                {quote.customerEmail && (
                  <a
                    href={mailLink(quote.customerEmail, 'Cotización Carpintería', 'Hola, recibimos tu solicitud...')}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                  >
                    Email
                  </a>
                )}
                
                <select
                  value={quote.status || 'nueva'}
                  onChange={(e) => setStatus(quote._id, e.target.value)}
                  className="px-3 py-1 border rounded text-sm"
                >
                  <option value="nueva">Nueva</option>
                  <option value="en_proceso">En Proceso</option>
                  <option value="cerrada">Cerrada</option>
                </select>
                
                <span className={`px-2 py-1 rounded text-xs ${
                  quote.status === 'cerrada' ? 'bg-green-100 text-green-800' :
                  quote.status === 'en_proceso' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {quote.status || 'nueva'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Componente para la pestaña de Configuración (corregido)
function SettingsTab() {
  const [form, setForm] = useState({ 
    bannerImageUrl: '', 
    heroTitle: '', 
    heroSubtitle: '' 
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadSettings = async () => {
    try {
      const res = await api.get('/settings');
      setForm(res.data?.data || res.data || {});
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      await api.put('/settings/admin', form);
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error guardando configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="card p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
            <div className="h-10 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSave} className="card p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Configuración del Sitio</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            URL del Banner
          </label>
          <input
            type="url"
            name="bannerImageUrl"
            value={form.bannerImageUrl || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://ejemplo.com/banner.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Título Principal
          </label>
          <input
            type="text"
            name="heroTitle"
            value={form.heroTitle || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Título de tu carpintería"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Subtítulo
          </label>
          <input
            type="text"
            name="heroSubtitle"
            value={form.heroSubtitle || ''}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Descripción breve de tus servicios"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? 'Guardando...' : 'Guardar Configuración'}
        </button>
      </div>
    </form>
  );
}



// Componente para la pestaña de Historial de Ventas
function SalesHistoryTab() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    from: '',
    to: '',
    product: '',
    page: 1,
    limit: 10
  });
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    currentPage: 1
  });

  // Cargar historial de ventas
const loadSalesHistory = async () => {
  try {
    setLoading(true);
    
    const params = {
      page: filters.page,
      limit: filters.limit,
      _: new Date().getTime(), // evitar cache
      ...(filters.from && { from: filters.from }),
      ...(filters.to && { to: filters.to }),
      ...(filters.product && { q: filters.product })
    };

    const res = await api.get('/ventas', { params });
    
    // Estructura CORREGIDA: { success: true, data: { ventas: [], pagination: {} } }
    if (res.data.success && res.data.data) {
      // ¡CORRECCIÓN: usar "ventas" en lugar de "items"!
      setSales(res.data.data.ventas || []);
      
      // Manejar la paginación
      if (res.data.data.pagination) {
        setPagination({
          total: res.data.data.pagination.total || 0,
          pages: res.data.data.pagination.pages || 1,
          currentPage: res.data.data.pagination.page || filters.page
        });
      } else {
        // Paginación por defecto si no viene
        setPagination({
          total: res.data.data.ventas?.length || 0,
          pages: 1,
          currentPage: 1
        });
      }
    } else {
      setSales([]);
    }
  } catch (error) {
    console.error('Error loading sales history:', error);
    alert(error.response?.data?.message || 'Error cargando historial de ventas');
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadSalesHistory();
  }, [filters.page, filters.limit]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const applyFilters = () => {
    loadSalesHistory();
  };

  const clearFilters = () => {
    setFilters({
      from: '',
      to: '',
      product: '',
      page: 1,
      limit: 10
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Calcular totales
  const totals = sales.reduce((acc, sale) => ({
    totalSales: acc.totalSales + (sale.total_venta || 0),
    totalProfit: acc.totalProfit + (sale.ganancia || 0),
    totalItems: acc.totalItems + (sale.cantidad || 0)
  }), { totalSales: 0, totalProfit: 0, totalItems: 0 });

  return (
    <div className="card p-4 bg-white rounded-lg shadow">
      <h3 className="font-semibold text-lg mb-4">Historial de Ventas</h3>

      {/* Filtros */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="font-medium mb-3">Filtros</h4>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Desde
            </label>
            <input
              type="date"
              value={filters.from}
              onChange={(e) => handleFilterChange('from', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hasta
            </label>
            <input
              type="date"
              value={filters.to}
              onChange={(e) => handleFilterChange('to', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Producto
            </label>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={filters.product}
              onChange={(e) => handleFilterChange('product', e.target.value)}
              className="w-full border rounded px-3 py-2 text-sm"
            />
          </div>
          
          <div className="flex items-end space-x-2">
            <button
              onClick={applyFilters}
              className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
            >
              Aplicar
            </button>
            <button
              onClick={clearFilters}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded text-sm hover:bg-gray-400"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Resumen de Totales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-green-800">Total Ventas</h4>
          <p className="text-2xl font-bold text-green-900">
            {formatCurrency(totals.totalSales)}
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-blue-800">Total Ganancia</h4>
          <p className="text-2xl font-bold text-blue-900">
            {formatCurrency(totals.totalProfit)}
          </p>
        </div>
        
        <div className="bg-purple-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-purple-800">Productos Vendidos</h4>
          <p className="text-2xl font-bold text-purple-900">
            {totals.totalItems.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Lista de Ventas */}
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Cargando ventas...</p>
        </div>
      ) : sales.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No se encontraron ventas en el período seleccionado.
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b p-3 text-left text-sm font-medium text-gray-700">
                    Fecha
                  </th>
                  <th className="border-b p-3 text-left text-sm font-medium text-gray-700">
                    Producto
                  </th>
                  <th className="border-b p-3 text-left text-sm font-medium text-gray-700">
                    Cantidad
                  </th>
                  <th className="border-b p-3 text-left text-sm font-medium text-gray-700">
                    Precio Unit.
                  </th>
                  <th className="border-b p-3 text-left text-sm font-medium text-gray-700">
                    Total Venta
                  </th>
                  <th className="border-b p-3 text-left text-sm font-medium text-gray-700">
                    Ganancia
                  </th>
                </tr>
              </thead>
             <tbody>
  {sales.map((sale) => (
    <tr key={sale._id} className="hover:bg-gray-50">
      <td className="border-b p-3 text-sm">
        {formatDate(sale.fecha)}
      </td>
      <td className="border-b p-3 text-sm">
        {sale.productoNombre}
      </td>
      <td className="border-b p-3 text-sm text-center">
        {sale.cantidad}
      </td>
      <td className="border-b p-3 text-sm text-right">
        {formatCurrency(sale.precio_unitario)}
      </td>
      <td className="border-b p-3 text-sm text-right font-medium">
        {formatCurrency(sale.total_venta)}
      </td>
      <td className="border-b p-3 text-sm text-right">
        <span className={sale.ganancia >= 0 ? 'text-green-600' : 'text-red-600'}>
          {formatCurrency(sale.ganancia)}
        </span>
      </td>
    </tr>
  ))}
</tbody>
            </table>
          </div>

          {/* Paginación */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Mostrando {(filters.page - 1) * filters.limit + 1} - {Math.min(filters.page * filters.limit, pagination.total)} de {pagination.total} ventas
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFilterChange('page', filters.page - 1)}
                  disabled={filters.page <= 1}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Anterior
                </button>
                
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handleFilterChange('page', pageNum)}
                      className={`px-3 py-1 border rounded text-sm ${
                        filters.page === pageNum
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handleFilterChange('page', filters.page + 1)}
                  disabled={filters.page >= pagination.pages}
                  className="px-3 py-1 border rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}


// Componente principal del Dashboard
export default function AdminDashboard() {
  const [tab, setTab] = useState('products');
  const navigate = useNavigate();

  // Verificar autenticación
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const tabs = [
  { id: 'products', label: 'Productos', component: <ProductsTab /> },
  { id: 'quotes', label: 'Cotizaciones', component: <QuotesTab /> },
  { id: 'sales', label: 'Historial Ventas', component: <SalesHistoryTab /> },
  { id: 'settings', label: 'Configuración', component: <SettingsTab /> }
];

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Panel de Administración</h1>
        <button
          onClick={() => {
            navigate('/admin/inventario');
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Inventario
        </button>
        <button
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Cerrar Sesión
        </button>

      </div>

      {/* Navegación por pestañas */}
      <div className="flex border-b mb-6">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`px-6 py-3 font-medium ${
              tab === id
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Contenido de la pestaña activa */}
      {tabs.find(t => t.id === tab)?.component}
    </div>
  );
}