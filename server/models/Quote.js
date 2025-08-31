import mongoose from 'mongoose';
const quoteSchema = new mongoose.Schema({
  customerName: { type: String, required: false, trim: true },
  customerEmail: { type: String, trim: true },
  customerPhone: { type: String, trim: true },
  message: { type: String, trim: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  quantity: { type: Number, default: 1, min: 1 },
  status: { type: String, enum: ['nueva', 'en_proceso', 'cerrada'], default: 'nueva' }
}, { timestamps: true });
export default mongoose.model('Quote', quoteSchema);
