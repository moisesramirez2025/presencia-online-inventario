import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  business: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Business', 
    required: true 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true 
  },
  description: { 
    type: String, 
    trim: true 
  },
  price: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  images: [{ 
    type: String 
  }],
  category: { 
    type: String, 
    trim: true 
  },
  // ⚠️ IMPORTANTE: Usa solo UN campo para el stock
  cant: { 
    type: Number, 
    default: 0, 
    min: 0 
  },
  // ❌ Elimina el campo 'stock' si existe para evitar confusiones
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

export default mongoose.model('Product', productSchema);