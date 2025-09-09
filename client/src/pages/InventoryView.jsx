import { useEffect, useState, useCallback } from 'react';
import { api } from '../api';
import { Link, useNavigate } from 'react-router-dom';

export default function InventoryView() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [sellForm, setSellForm] = useState({
    cantidadVender: 1,
    precio_unitario: 0,
    ganancia: 0
  });
  const [q, setQ] = useState('');

  const token = localStorage.getItem('token');
  
  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  // Normaliza imagen principal
  function firstImage(p) {
    if (!p?.images) return 'https://via.placeholder.com/600x400?text=Producto';
    if (Array.isArray(p.images)) return p.images[0] || 'https://via.placeholder.com/600x400?text=Producto';
    if (typeof p.images === 'string') return p.images;
    return 'https://via.placeholder.com/600x400?text=Producto';
  }

  const loadInventory = useCallback(async (query = '') => {
    try {
      setLoading(true);
      const res = await api.get('/products/admin', { 
        params: { q: query || undefined } 
      });
      setItems(res.data?.data || res.data || []);
    } catch (err) {
      console.error('Error cargando inventario:', err);
      alert(err.response?.data?.message || 'Error cargando inventario');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { 
    loadInventory(); 
  }, [loadInventory]);

  function onSellFormChange(e) {
    const { name, value } = e.target;
    setSellForm(prev => ({ 
      ...prev, 
      [name]: name.includes('precio') || name.includes('ganancia') 
        ? Number(value) 
        : value 
    }));
  }

  async function handleSellProduct(e) {
    e.preventDefault();
    if (!selectedProduct) return;

    const cantidadVendida = Number(sellForm.cantidadVender || 0);
    const stockActual = Number(selectedProduct.cant || 0);
    
    // Validaciones
    if (!Number.isInteger(cantidadVendida) || cantidadVendida <= 0) {
      alert('La cantidad a vender debe ser un número entero positivo.');
      return;
    }

    if (cantidadVendida > stockActual) {
      alert(`No hay suficiente stock. Disponible: ${stockActual}`);
      return;
    }

    if (sellForm.precio_unitario <= 0) {
      alert('El precio unitario debe ser mayor a 0');
      return;
    }

    if (sellForm.ganancia < 0) {
      alert('La ganancia no puede ser negativa');
      return;
    }

    try {
      // 1. Registrar la venta en el historial
      await api.post(`/ventas/${selectedProduct._id}`, {
        cantidad: cantidadVendida,
        precio_unitario: sellForm.precio_unitario,
        ganancia: sellForm.ganancia
      });

      // 2. Recargar el inventario para ver el stock actualizado
      await loadInventory(q);
      
      // 3. Cerrar modal y resetear form
      setShowModal(false);
      setSelectedProduct(null);
      setSellForm({
        cantidadVender: 1,
        precio_unitario: 0,
        ganancia: 0
      });

      alert(`✅ Venta registrada exitosamente!`);

    } catch (err) {
      console.error('Error en venta:', err);
      alert(err.response?.data?.message || 'Error procesando la venta');
    }
  }

  async function handleSearch(e) {
    e.preventDefault();
    await loadInventory(q);
  }

  // Precio sugerido basado en el precio del producto
  const suggestedPrice = selectedProduct ? Number(selectedProduct.price || 0) : 0;

  return (
    <>
      {/* Barra superior */}
      <div className="flex flex-wrap items-center justify-between gap-3 m-5">
        <form onSubmit={handleSearch} className="flex gap-2 min-w-0">
          <input
            className="input border rounded px-3 py-2 w-64"
            placeholder="Buscar en inventario…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <button 
            type="submit"
            className="btn bg-blue-600 text-white rounded px-4 py-2 hover:bg-blue-700"
          >
            Buscar
          </button>
        </form>

        <div className="flex items-center gap-4">
          {token ? (
            <>
              <Link to="/inventario" className="text-blue-600 hover:underline">
                Inventario
              </Link>
              <Link to="/dashboard" className="text-blue-600 hover:underline">
                Panel
              </Link>
              <Link to="/ventas" className="text-blue-600 hover:underline">
                Ventas
              </Link>
              <button 
                onClick={logout} 
                className="btn border border-gray-300 rounded px-3 py-2 hover:bg-gray-50"
              >
                Salir
              </button>
            </>
          ) : (
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Modal de venta */}
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl min-w-[400px] max-w-md relative">
            <button
              className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-700"
              onClick={() => {
                setShowModal(false);
                setSelectedProduct(null);
                setSellForm({
                  cantidadVender: 1,
                  precio_unitario: 0,
                  ganancia: 0
                });
              }}
              aria-label="Cerrar"
            >
              &times;
            </button>

            <h2 className="text-xl font-bold mb-4 text-gray-800">
              Vender Producto
            </h2>
            
            <div className="mb-4 p-3 bg-gray-50 rounded">
              <p className="font-semibold">{selectedProduct.title}</p>
              <p className="text-sm text-gray-600">
                Stock disponible: <span className="font-bold">{selectedProduct.cant}</span>
              </p>
              <p className="text-sm text-gray-600">
                Precio sugerido: <span className="font-bold">${suggestedPrice.toLocaleString()}</span>
              </p>
            </div>

            <form onSubmit={handleSellProduct}>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cantidad a vender *
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="cantidadVender"
                    type="number"
                    min="1"
                    max={selectedProduct.cant}
                    value={sellForm.cantidadVender}
                    onChange={onSellFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio unitario *
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="precio_unitario"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={sellForm.precio_unitario || suggestedPrice}
                    onChange={onSellFormChange}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ganancia *
                  </label>
                  <input
                    className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    name="ganancia"
                    type="number"
                    step="0.01"
                    min="0"
                    value={sellForm.ganancia}
                    onChange={onSellFormChange}
                    required
                  />
                </div>

                {sellForm.precio_unitario > 0 && sellForm.cantidadVender > 0 && (
                  <div className="p-3 bg-blue-50 rounded">
                    <p className="text-sm font-semibold">
                      Total venta: ${(sellForm.precio_unitario * sellForm.cantidadVender).toLocaleString()}
                    </p>
                    <p className="text-sm">
                      Ganancia total: ${(sellForm.ganancia * sellForm.cantidadVender).toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white rounded px-4 py-2 hover:bg-green-700 disabled:opacity-50"
                >
                  Confirmar Venta
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 rounded px-4 py-2 hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Lista de productos */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold text-gray-800">Inventario</h3>
          {loading && <span className="text-sm text-gray-500">Cargando…</span>}
        </div>

        {items.length === 0 && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay productos en inventario</p>
            <Link 
              to="/dashboard" 
              className="text-blue-600 hover:underline mt-2 inline-block"
            >
              Agregar productos
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {items.map((product) => {
              const imageUrl = firstImage(product);
              const price = Number(product.price || 0).toLocaleString('es-CO', { 
                style: 'currency', 
                currency: 'COP' 
              });
              const stock = Number(product.cant || 0);

              return (
                <div key={product._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <img 
                      className="w-20 h-20 object-cover rounded" 
                      src={imageUrl} 
                      alt={product.title} 
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        {product.title}
                      </h4>
                      <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                        {product.description}
                      </p>
                      <div className="space-y-1 text-sm">
                        <p className="text-green-600 font-medium">{price}</p>
                        <p className={stock > 0 ? "text-blue-600" : "text-red-600"}>
                          Stock: {stock}
                        </p>
                        <p className="text-gray-500">
                          {product.isActive ? '🟢 Activo' : '🔴 Inactivo'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      className="w-full bg-blue-600 text-white rounded px-3 py-2 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={stock <= 0}
                      onClick={() => {
                        setSelectedProduct(product);
                        setSellForm({
                          cantidadVender: 1,
                          precio_unitario: Number(product.price || 0),
                          ganancia: Number(product.price || 0) * 0.3 // 30% de ganancia por defecto
                        });
                        setShowModal(true);
                      }}
                    >
                      {stock > 0 ? 'Vender Producto' : 'Sin Stock'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando inventario...</p>
          </div>
        )}
      </div>
    </>
  );
}