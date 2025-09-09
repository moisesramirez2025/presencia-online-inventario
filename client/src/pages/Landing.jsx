import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { Link } from 'react-router-dom';
// import '../css/app.css';

export default function Landing() {
  const [setting, setSetting] = useState(null);

// aqui
   const [reversed, setReversed] = useState(false);

  const toggleOrder = () => {
    setReversed(!reversed);
  };
// asta aqui



  useEffect(() => { api.get('/settings').then(res => setSetting(res.data)); }, []);
  return (
    <>
    {/* aqui */}
    <div className={`grid-container ${reversed ? 'reversed-order' : ''}`}>
        <div className="box box1">Caja 1</div>
        <div className="box box2">Caja 2</div>
        <div className="box box3">Caja 3</div>
      </div>
      <button onClick={toggleOrder}>Cambiar Orden</button>
      
      {/* asta aqui */}


      <section className="relative">
        <img
          src={setting?.bannerImageUrl || 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?q=80&w=1600&auto=format&fit=crop'}
          alt="Banner"
          className="w-full h-[360px] object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-center">
          <div className="container text-white">
            <h1 className="text-3xl sm:text-5xl font-bold">{setting?.heroTitle || 'Hecho a tu medida'}</h1>
            <p className="mt-2 max-w-xl text-lg">{setting?.heroSubtitle || 'Muebles a medida con calidad artesanal'}</p>
            <div className="mt-5 flex gap-3">
              <Link to="/productos" className="btn">Ver productos</Link>
              <Link to="/cotizar" className="btn bg-white text-black">Solicitar cotización</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="container py-10">
        <h2 className="text-2xl font-semibold">¿Por qué elegirnos?</h2>
        <ul className="grid sm:grid-cols-3 gap-4 mt-4">
          <li className="card">Diseño personalizado</li>
          <li className="card">Materiales de alta calidad</li>
          <li className="card">Entrega puntual</li>
        </ul>
      </section>
    </>
  );
}
