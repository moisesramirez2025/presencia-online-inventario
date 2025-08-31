import { validationResult } from 'express-validator';
import Product from '../models/Product.js';

export const listPublic = async (req, res) => {
  const { q = '', category } = req.query;
  const filter = {
    isActive: true,
    ...(q ? { title: { $regex: q, $options: 'i' } } : {}),
    ...(category ? { category } : {})
  };
  const items = await Product.find(filter).sort({ createdAt: -1 });
  res.json(items);
};

export const listAdmin = async (req, res) => {
  const items = await Product.find().sort({ createdAt: -1 });
  res.json(items);
};

export const create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const item = await Product.create(req.body);
  res.status(201).json(item);
};

export const update = async (req, res) => {
  const item = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!item) return res.status(404).json({ message: 'No encontrado' });
  res.json(item);
};

export const remove = async (req, res) => {
  const ok = await Product.findByIdAndDelete(req.params.id);
  if (!ok) return res.status(404).json({ message: 'No encontrado' });
  res.json({ message: 'Eliminado' });
};
