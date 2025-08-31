import mongoose from 'mongoose';
const productSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  price: { type: Number, required: true, min: 0 },
  images: [{ type: String }],
  category: { type: String, trim: true },
  cant: { type: Number, default: 0, min: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Product', productSchema);
