import mongoose from 'mongoose';

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  contactEmail: { type: String, trim: true, lowercase: true },
  phone: { type: String, trim: true },
  address: { type: String, trim: true }
}, { timestamps: true });

export default mongoose.model('Business', businessSchema);
