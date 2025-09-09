import jwt from 'jsonwebtoken';
import AdminUser from '../models/AdminUser.js';
import Business from '../models/Business.js';

// Firma token 7 días
function signToken({ id, email, role, business }) {
  return jwt.sign({ id, email, role, business }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// POST /api/auth/admin/login
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: 'Email y contraseña requeridos' });

    let admin = await AdminUser.findOne({ email }).populate('business');
    if (!admin) return res.status(400).json({ message: 'Credenciales inválidas' });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(400).json({ message: 'Credenciales inválidas' });

    const businessPayload = admin.business && admin.business._id
      ? { id: admin.business._id, name: admin.business.name || '' }
      : admin.business
        ? { id: admin.business, name: '' }
        : null;

    if (!businessPayload) {
      return res.status(400).json({ message: 'El administrador no tiene negocio asignado.' });
    }

    const token = signToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      business: businessPayload.id
    });

    return res.json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      business: businessPayload
    });
  } catch (e) {
    console.error('[adminLogin] error:', e);
    return res.status(500).json({ message: 'Error en login' });
  }
};

// POST /api/auth/admin/register-owner
// Crea un negocio + primer admin (owner)
export const registerOwner = async (req, res) => {
  try {
    const { businessName, contactEmail, phone, address, name, email, password } = req.body || {};
    if (!businessName || !name || !email || !password) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const exists = await AdminUser.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Ya existe un admin con ese correo' });

    const biz = await Business.create({ name: businessName, contactEmail, phone, address });

    const admin = await AdminUser.create({
      name,
      email,
      password,          // se hashea en pre-save
      business: biz._id,
      role: 'owner'
    });

    const token = signToken({
      id: admin._id,
      email: admin.email,
      role: admin.role,
      business: biz._id
    });

    return res.status(201).json({
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
      business: { id: biz._id, name: biz.name }
    });
  } catch (e) {
    console.error('[registerOwner] error:', e);
    return res.status(500).json({ message: 'Error registrando negocio' });
  }
};
