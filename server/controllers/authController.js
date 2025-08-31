import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import AdminUser from '../models/AdminUser.js';

function sign(user) {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
}

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const user = await AdminUser.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Credenciales inválidas' });
  const token = sign(user);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
};
