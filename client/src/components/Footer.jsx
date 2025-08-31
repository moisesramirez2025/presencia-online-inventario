export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-6 text-sm text-gray-600">
        © {new Date().getFullYear()} Carpintería & Almacén de Muebles
      </div>
    </footer>
  );
}
