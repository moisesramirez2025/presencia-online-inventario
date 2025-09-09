import { useEffect, useState } from "react";
import { getVentas } from "../api/ventas";

function money(n) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP" })
    .format(Number(n || 0));
}
function fdate(iso) {
  return new Date(iso).toLocaleString("es-CO", { dateStyle: "short", timeStyle: "short" });
}

export default function VentasPage() {
  const [ventas, setVentas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);

  async function load() {
    setLoading(true);
    setErr("");
    try {
      const data = await getVentas({ page, limit, from, to, q });
      setVentas(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e) {
      setErr(e.message || "Error cargando ventas");
      setVentas([]);
      setTotal(0);
      setPages(1);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [page, limit]);

  function aplicarFiltros() {
    setPage(1);
    load();
  }

  const vacio = !loading && ventas.length === 0
    ? (from || to || q ? "Sin resultados con los filtros." : "No hay ventas registradas aún.")
    : "";

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Historial de ventas</h1>

      <div className="flex flex-wrap gap-2 mb-4">
        <input className="border px-2 py-1 rounded" placeholder="Buscar producto..."
               value={q} onChange={(e)=>setQ(e.target.value)} />
        <input type="date" className="border px-2 py-1 rounded"
               value={from} onChange={(e)=>setFrom(e.target.value)} />
        <input type="date" className="border px-2 py-1 rounded"
               value={to} onChange={(e)=>setTo(e.target.value)} />
        <select className="border px-2 py-1 rounded"
                value={limit} onChange={(e)=>{ setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={5}>5 / pág.</option>
          <option value={10}>10 / pág.</option>
          <option value={20}>20 / pág.</option>
          <option value={50}>50 / pág.</option>
        </select>
        <button className="bg-black text-white px-3 rounded" onClick={aplicarFiltros}>
          Aplicar
        </button>
        <button className="border px-3 rounded"
                onClick={()=>{ setQ(""); setFrom(""); setTo(""); setPage(1); load(); }}>
          Limpiar
        </button>
      </div>

      {err && <div className="text-red-600 mb-2">⚠ {err}</div>}
      {loading && <div className="mb-2">Cargando...</div>}

      <div className="overflow-auto border rounded">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2">Fecha</th>
              <th className="text-left p-2">Producto</th>
              <th className="text-right p-2">Cantidad</th>
              <th className="text-right p-2">Precio</th>
              <th className="text-right p-2">Total</th>
              <th className="text-right p-2">Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map(v => (
              <tr key={v._id} className="border-t">
                <td className="p-2">{fdate(v.fecha)}</td>
                <td className="p-2">{v.productoNombre}</td>
                <td className="p-2 text-right">{v.cantidad}</td>
                <td className="p-2 text-right">{money(v.precio_unitario)}</td>
                <td className="p-2 text-right">{money(v.total_venta)}</td>
                <td className="p-2 text-right">{money(v.ganancia)}</td>
              </tr>
            ))}
            {vacio && (
              <tr><td colSpan={6} className="p-3 text-center text-gray-500">{vacio}</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span>Página {page} de {pages} — {total} ventas</span>
        <div className="flex gap-2">
          <button className="border px-2 rounded" disabled={page<=1}
                  onClick={()=>setPage(p=>p-1)}>← Anterior</button>
          <button className="border px-2 rounded" disabled={page>=pages}
                  onClick={()=>setPage(p=>p+1)}>Siguiente →</button>
        </div>
      </div>
    </div>
  );
}
