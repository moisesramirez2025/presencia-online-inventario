import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Business from '../models/Business.js';
import AdminUser from '../models/AdminUser.js';
import Product from '../models/Product.js';
import Setting from '../models/Setting.js';

async function seedDatabase() {
  try {
    console.log('🌱 Iniciando seed de datos...');
    await connectDB(process.env.MONGODB_URI);

    // Limpiar datos existentes (opcional)
    await Business.deleteMany({});
    await AdminUser.deleteMany({});
    await Product.deleteMany({});
    await Setting.deleteMany({});

    console.log('🧹 Datos antiguos eliminados');

    // 1. Crear Negocio
    const business = await Business.create({
      name: "Carpintería Artesanal Hernández",
      contactEmail: "contacto@carpinteriahernandez.com",
      phone: "+1234567890",
      address: "Av. Principal #123, Ciudad"
    });
    console.log('✅ Negocio creado:', business.name);

    // 2. Crear Usuario Admin
    const adminUser = await AdminUser.create({
      name: "Juan Hernández",
      email: "admin@carpinteria.com",
      password: "password123", // Se hashea automáticamente
      business: business._id,
      role: "owner"
    });
    console.log('✅ Admin usuario creado:', adminUser.email);

    // 3. Crear Productos de Ejemplo
    const products = await Product.create([
      {
        business: business._id,
        title: "Mesa de Roble Macizo",
        description: "Mesa rectangular de roble macizo con terminación natural",
        price: 1200,
        images: ["mesa-roble-1.jpg", "mesa-roble-2.jpg"],
        category: "mesas",
        cant: 15,
        isActive: true
      },
      {
        business: business._id,
        title: "Silla de Comedor Eames",
        description: "Silla estilo Eames con estructura de madera y asiento tapizado",
        price: 250,
        images: ["silla-eames-1.jpg"],
        category: "sillas",
        cant: 30,
        isActive: true
      },
      {
        business: business._id,
        title: "Estantería Flotante",
        description: "Estantería flotante de pino con capacidad para 25kg",
        price: 450,
        images: ["estanteria-1.jpg", "estanteria-2.jpg"],
        category: "estanterias",
        cant: 8,
        isActive: true
      },
      {
        business: business._id,
        title: "Cama King Size",
        description: "Cama king size de cedro con cabecera tapizada",
        price: 2200,
        images: ["cama-king-1.jpg"],
        category: "camas",
        cant: 5,
        isActive: true
      },
      {
        business: business._id,
        title: "Escritorio Ejecutivo",
        description: "Escritorio ejecutivo de nogal con cajones incorporados",
        price: 850,
        images: ["escritorio-1.jpg"],
        category: "escritorios",
        cant: 12,
        isActive: true
      }
    ]);
    console.log('✅ Productos creados:', products.length);

    // 4. Crear Configuración
    const setting = await Setting.create({
      bannerImageUrl: "https://ejemplo.com/banner.jpg",
      heroTitle: "Carpintería Artesanal Hernández",
      heroSubtitle: "Muebles hechos a mano con pasión y calidad"
    });
    console.log('✅ Configuración creada');

    // 5. Mostrar resumen
    console.log('\n📊 RESUMEN DE DATOS CREADOS:');
    console.log('🏢 Negocio:', business.name);
    console.log('👤 Admin:', adminUser.email);
    console.log('📦 Productos:', products.length);
    console.log('⚙️  Configuración: OK');
    
    console.log('\n🔑 Credenciales para login:');
    console.log('Email: admin@carpinteria.com');
    console.log('Password: password123');

    await mongoose.connection.close();
    console.log('\n🎉 Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error en seed:', error);
    process.exit(1);
  }
}

// Ejecutar solo si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase();
}

export default seedDatabase;