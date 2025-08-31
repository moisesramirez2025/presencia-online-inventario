export function notFound(req, res) {
  res.status(404).json({ message: 'Ruta no encontrada' });
}
export function errorHandler(err, req, res, next) {
  console.error('error'/*porsiacaso */, err);
  res.status(err.status || 500).json({ message: err.message || 'Error servidor' });
}
