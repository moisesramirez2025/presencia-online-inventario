// client/src/pages/Landing.jsx
import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [setting, setSetting] = useState(null);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar configuración
    api.get('/settings')
      .then(res => setSetting(res.data))
      .catch(error => console.error('Error loading settings:', error));
    
    // Cargar algunos productos destacados - MANEJO SEGURO
    setLoading(true);
    api.get('/products?limit=6')
      .then(res => {
        console.log('Respuesta productos:', res.data); // Para debug
        
        // Verificar diferentes estructuras de respuesta
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
          console.warn('Estructura no reconocida, usando array vacío');
          products = [];
        }
        
        setFeaturedProducts(products);
      })
      .catch(error => {
        console.error('Error loading products:', error);
        setFeaturedProducts([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
      {/* Hero Banner */}
      <section className="relative">
        <img
          src={setting?.bannerImageUrl || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop'}
          alt="Banner Carpintería"
          className="w-full h-[400px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container text-white text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-4">
              {setting?.heroTitle || 'Hecho a tu medida'}
            </h1>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              {setting?.heroSubtitle || 'Muebles a medida con calidad artesanal'}
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/productos" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
                Ver Catálogo
              </Link>
              <Link to="/cotizar" className="bg-white text-black hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors">
                Solicitar Cotización
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Productos Destacados */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Productos Destacados</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-500 mt-2">Cargando productos...</p>
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No hay productos destacados disponibles en este momento.
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map(product => (
                <div key={product._id} className="border rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                  <img
                    src={product.images?.[0] || 'https://via.placeholder.com/300x200?text=Producto'}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{product.title}</h3>
                    <p className="text-gray-600 mb-4">
                      {product.description?.substring(0, 100)}
                      {product.description?.length > 100 ? '...' : ''}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-green-600">
                        ${Number(product.price || 0).toLocaleString()}
                      </span>
                      <Link 
                        to={`/cotizar?productId=${product._id}&productTitle=${encodeURIComponent(product.title)}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700"
                      >
                        Cotizar
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/productos" className="border border-gray-300 px-8 py-3 rounded-lg hover:bg-gray-50 transition-colors">
                Ver Todos los Productos
              </Link>
            </div>
          </>
        )}
      </section>

      {/* Sección "Mi Negocio" */}
      <section className="bg-gray-100 py-16">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">¿Tienes un Negocio de Carpintería?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Únete a nuestra plataforma y muestra tus productos a miles de clientes potenciales
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/registro" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors">
              Registrar Mi Negocio
            </Link>
            <Link to="/login" className="border border-gray-300 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Acceder a Mi Cuenta
            </Link>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="container py-16">
        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegirnos?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🎨</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Diseño Personalizado</h3>
            <p className="text-gray-600">Muebles únicos diseñados específicamente para tus espacios y necesidades</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⭐</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Calidad Premium</h3>
            <p className="text-gray-600">Materiales de primera calidad y craftsmanship experto en cada pieza</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚚</span>
            </div>
            <h3 className="font-semibold text-lg mb-2">Entrega Puntual</h3>
            <p className="text-gray-600">Cumplimos con los plazos de entrega acordados sin comprometer la calidad</p>
          </div>
        </div>
      </section>
    </>
  );
}