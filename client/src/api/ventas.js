import { api } from "../api";

export async function getVentas({ page = 1, limit = 10, from, to, q } = {}) {
  const params = {};
  if (page) params.page = page;
  if (limit) params.limit = limit;
  if (from) params.from = from;
  if (to) params.to = to;
  if (q) params.q = q;

  const res = await api.get("/ventas", { params });
  return res.data; // { items, total, page, pages }
}
