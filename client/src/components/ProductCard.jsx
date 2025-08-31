export default function ProductCard({ p, onSelect }) {
  const img = p.images?.[0] || 'https://via.placeholder.com/600x400?text=Mueble';
  return (
    <div className="card">
      <img src={img} alt={p.title} className="w-full h-40 object-cover rounded" />
      <div className="mt-3">
        <h3 className="font-semibold">{p.title}</h3>
        <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
        <p className="text-sm text-gray-600 line-clamp-2">Disponibles:{p.cant}</p>
        <div className="mt-2 flex items-center justify-between">
          <span className="font-bold">${p.price?.toLocaleString()}</span>
          {onSelect && (<button className="btn" onClick={() => onSelect(p)}>Agregar</button>)}
        </div>
      </div>
    </div>
  );
}
