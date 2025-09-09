// import { Navigate } from 'react-router-dom';
// export default function ProtectedRoute({ children }) {
//   const token = localStorage.getItem('token');
//   return token ? children : <Navigate to="/admin/login" replace />;
// }
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // lo guardas en el login
  if (!token) return <Navigate to="/login" replace />;
  return children;
}