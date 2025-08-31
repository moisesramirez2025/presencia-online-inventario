import mongoose from 'mongoose';
const settingSchema = new mongoose.Schema({
  bannerImageUrl: { type: String, default: '' },
  heroTitle: { type: String, default: 'Hecho a tu medida' },
  heroSubtitle: { type: String, default: 'Muebles a medida con calidad artesanal' }
}, { timestamps: true });
export default mongoose.model('Setting', settingSchema);
