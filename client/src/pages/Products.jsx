import { useEffect, useState } from 'react';
import { api } from '../api';
import ProductCard from '../components/ProductCard.jsx';
import { useNavigate } from 'react-router-dom';

export default function Products() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  useEffect(() => { api.get('/products').then(res => setItems(res.data)); }, []);

  function search(e) {
    e.preventDefault();
    api.get('/products', { params: { q } }).then(res => setItems(res.data));
  }
  function addToQuote(p) {
    navigate(`/cotizar?productId=${p._id}&productTitle=${encodeURIComponent(p.title)}`);
  }
  return (
    <div className="container py-8">
      <h1 className="text-2xl font-semibold mb-4">Productos</h1>
      <form onSubmit={search} className="flex gap-2 mb-4">
        <input className="input" placeholder="Buscar..." value={q} onChange={e => setQ(e.target.value)} />
        <button className="btn">Buscar</button>
      </form>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map(p => <ProductCard key={p._id} p={p} onSelect={addToQuote} />)}
      </div>
    </div>
  );
}
