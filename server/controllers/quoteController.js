import { validationResult } from 'express-validator';
import Quote from '../models/Quote.js';

export const createPublic = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const quote = await Quote.create(req.body);
  res.status(201).json({ message: 'Cotización enviada', quoteId: quote._id });
};

export const listAdmin = async (req, res) => {
  const { status } = req.query;
  const filter = status ? { status } : {};
  const items = await Quote.find(filter).populate('product').sort({ createdAt: -1 });
  res.json(items);
};

export const updateStatus = async (req, res) => {
  const { status } = req.body;
  const q = await Quote.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!q) return res.status(404).json({ message: 'No encontrado' });
  res.json(q);
};
