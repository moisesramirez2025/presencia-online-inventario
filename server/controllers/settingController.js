import { validationResult } from 'express-validator';
import Setting from '../models/Setting.js';

async function getSingleton() {
  let s = await Setting.findOne();
  if (!s) s = await Setting.create({});
  return s;
}

export const getPublic = async (req, res) => {
  const s = await getSingleton();
  res.json({ bannerImageUrl: s.bannerImageUrl, heroTitle: s.heroTitle, heroSubtitle: s.heroSubtitle });
};

export const updateAdmin = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const s = await getSingleton();
  Object.assign(s, req.body);
  await s.save();
  res.json(s);
};
