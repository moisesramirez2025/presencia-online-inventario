import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { connectDB } from './config/db.js';

// Importar rutas
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import quoteRoutes from './routes/quoteRoutes.js';
import settingRoutes from './routes/settingRoutes.js';
import adminAuthRoutes from './routes/adminAuthRoutes.js';
import ventasRoutes from './routes/ventas.routes.js';

// Middleware de errores
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// 🔒 Middleware de seguridad
app.use(helmet());

// 🌐 Configuración CORS para desarrollo y producción
const allowedOrigins = [
  'http://localhost:5173', 
  'http://localhost:4000',
  process.env.CLIENT_ORIGIN // Para producción
].filter(Boolean); // Filtra valores undefined

// app.use(cors({
//   origin: allowedOrigins,
//   credentials: true
// }));
app.use(cors({
  origin: [
    process.env.VITE_FRONTEND_URL || "http://localhost:5173",
    "https://sparkling-transformation-production-fecf.up.railway.app"  // TU URL REAL EN RAILWAY
  ],
  credentials: true,  // IMPORTANTE
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Maneja preflight requests
app.options("*", cors());




// 📊 Logging y parsing de JSON
app.use(morgan('dev'));
app.use(express.json({ limit: '1mb' }));

// 🛣️ Definición de rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/settings', settingRoutes);
app.use('/api/auth/admin', adminAuthRoutes);
app.use('/api', ventasRoutes);

// ℹ️ Ruta de salud para verificar que el API funciona
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API de Carpintería Vitrina funcionando',
    timestamp: new Date().toISOString()
  });
});

// 🚨 Manejo de errores (siempre al final)
app.use(notFound);
app.use(errorHandler);

// 🚀 Inicialización del servidor
const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor ejecutándose en http://localhost:${PORT}`);
      console.log(`📋 Documentación API disponible en http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar servidor:', error.message);
    process.exit(1);
  }
};

startServer();