import mongoose from "mongoose";

const historialVentaSchema = new mongoose.Schema({
  fecha: { 
    type: Date, 
    default: Date.now 
  },
  // ⚠️ IMPORTANTE: Usa el MISMO nombre que en Product.js
  negocio: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Business", 
    required: true 
  },
  productoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  productoNombre: { 
    type: String, 
    required: true 
  },
  cantidad: { 
    type: Number, 
    required: true, 
    min: 1 
  },
  precio_unitario: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  total_venta: { 
    type: Number, 
    required: true, 
    min: 0 
  },
  ganancia: { 
    type: Number, 
    required: true 
  }
}, { 
  timestamps: true 
});

// Índices para mejor rendimiento
historialVentaSchema.index({ negocio: 1, fecha: -1 });
historialVentaSchema.index({ productoId: 1, fecha: -1 });

export default mongoose.model("HistorialVenta", historialVentaSchema);