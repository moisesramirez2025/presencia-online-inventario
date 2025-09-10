// client/src/pages/Products.jsx
import { useEffect, useState } from 'react';
import { api } from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function Products() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => { 
    loadProducts();
  }, []);

const loadProducts = async () => {
  try {
    setLoading(true);
    const params = { q, category };
    const res = await api.get('/products', { params });
    
    // Manejar diferentes estructuras de respuesta
    let products = [];
    
    if (Array.isArray(res.data)) {
      products = res.data;
    } else if (res.data && Array.isArray(res.data.items)) {
      products = res.data.items;
    } else if (res.data && Array.isArray(res.data.data)) {
      products = res.data.data;
    } else if (res.data && res.data.success && Array.isArray(res.data.data)) {
      products = res.data.data;
    } else {
      console.warn('Estructura no reconocida:', res.data);
      products = [];
    }
    
    setItems(products);
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Error cargando productos');
  } finally {
    setLoading(false);
  }
};

  const search = (e) => {
    e.preventDefault();
    loadProducts();
  };

  const addToQuote = (product) => {
    navigate(`/cotizar?productId=${product._id}&productTitle=${encodeURIComponent(product.title)}`);
  };

  const clearFilters = () => {
    setQ('');
    setCategory('');
    loadProducts();
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Catálogo de Productos</h1>

      {/* Filtros */}
      <form onSubmit={search} className="bg-gray-50 p-6 rounded-lg mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Buscar producto</label>
            <input
              type="text"
              placeholder="Nombre del producto..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Categoría</label>
            <input
              type="text"
              placeholder="Ej: mesas, sillas..."
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          
          <div className="flex items-end gap-2">
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Buscar
            </button>
            <button type="button" onClick={clearFilters} className="border border-gray-300 px-6 py-2 rounded hover:bg-gray-50">
              Limpiar
            </button>
          </div>
        </div>
      </form>

      {/* Resultados */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-2">Cargando productos...</p>
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No se encontraron productos. {q || category ? 'Intenta con otros filtros.' : 'Pronto agregaremos más productos.'}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map(product => (
              <div key={product._id} className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.images?.[0] || 'https://via.placeholder.com/400x300?text=Producto'}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {product.description?.substring(0, 100)}{product.description?.length > 100 ? '...' : ''}
                  </p>
                  
                  {product.category && (
                    <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mb-3">
                      {product.category}
                    </span>
                  )}
                  
                  <div className="flex justify-between items-center mt-4">
                    <span className="text-2xl font-bold text-green-600">
                      ${Number(product.price || 0).toLocaleString()}
                    </span>
                    <button
                      onClick={() => addToQuote(product)}
                      className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                    >
                      Solicitar Cotización
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-gray-600">
              Mostrando {items.length} producto{items.length !== 1 ? 's' : ''}
            </p>
          </div>
        </>
      )}
    </div>
  );
}