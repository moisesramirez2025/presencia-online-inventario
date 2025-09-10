// client/src/pages/Quote.jsx
import { useState, useEffect } from 'react';
import { api } from '../api';
import { useSearchParams, Link } from 'react-router-dom';

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
  const [loading, setLoading] = useState(false);
  const [productInfo, setProductInfo] = useState(null);

  const productId = params.get('productId');
  const productTitle = params.get('productTitle');

  useEffect(() => {
    if (productId && !productTitle) {
      // Si tenemos ID pero no título, cargar info del producto
      loadProductInfo();
    }
  }, [productId, productTitle]);

  const loadProductInfo = async () => {
    try {
      const res = await api.get(`/products/${productId}`);
      setProductInfo(res.data);
    } catch (error) {
      console.error('Error loading product info:', error);
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = { ...form };
      if (!data.product) delete data.product;

      const res = await api.post('/quotes', data);
      alert(res.data.message || 'Cotización enviada exitosamente');
      
      // Reset form
      setForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        message: '',
        product: '',
        quantity: 1
      });
    } catch (error) {
      console.error('Error submitting quote:', error);
      alert(error.response?.data?.message || 'Error enviando la cotización');
    } finally {
      setLoading(false);
    }
  };

  const displayProductTitle = productTitle || productInfo?.title;

  return (
    <div className="container py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Solicitar Cotización</h1>

      {displayProductTitle && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-blue-800 mb-2">Producto seleccionado:</h3>
          <p className="text-blue-900">{displayProductTitle}</p>
          {!productId && (
            <p className="text-sm text-blue-600 mt-1">
              <Link to="/productos" className="underline">Ver más productos</Link>
            </p>
          )}
        </div>
      )}

      <form onSubmit={submit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Nombre completo *
            </label>
            <input
              type="text"
              name="customerName"
              value={form.customerName}
              onChange={onChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tu nombre completo"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Correo electrónico *
            </label>
            <input
              type="email"
              name="customerEmail"
              value={form.customerEmail}
              onChange={onChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Teléfono / WhatsApp
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={form.customerPhone}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="+57 300 123 4567"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Cantidad
            </label>
            <input
              type="number"
              name="quantity"
              min="1"
              value={form.quantity}
              onChange={onChange}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Mensaje / Detalles adicionales
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              rows={4}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe lo que necesitas, medidas específicas, preferencias de materiales, etc."
            />
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Enviando...' : 'Enviar Solicitud'}
          </button>
          
          <Link
            to="/productos"
            className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Ver Más Productos
          </Link>
        </div>
      </form>

      <div className="mt-8 text-center text-gray-600">
        <p>Te contactaremos dentro de las próximas 24 horas para discutir tu proyecto.</p>
      </div>
    </div>
  );
}