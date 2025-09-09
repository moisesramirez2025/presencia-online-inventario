import jwt from 'jsonwebtoken';

/**
 * Middleware de autenticación requerida
 * Verifica el token JWT y extrae información del usuario
 */
export function authRequired(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  const token = authHeader.slice(7); // Remueve "Bearer " del token

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Estructura consistente para req.user
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      businessId: payload.businessId || payload.business
    };

    // Validación básica del payload
    if (!req.user.id || !req.user.businessId) {
      return res.status(401).json({ message: 'Token inválido: información incompleta' });
    }

    next();
  } catch (error) {
    console.error('Error verifying token:', error.message);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expirado' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token inválido' });
    }
    
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
}

/**
 * Middleware para acceso solo de administradores
 * Debe usarse después de authRequired
 */
export function adminOnly(req, res, next) {
  if (!req.user || !['owner', 'staff', 'admin'].includes(req.user.role)) {
    return res.status(403).json({ 
      message: 'Acceso denegado: se requieren privilegios de administrador' 
    });
  }
  next();
}