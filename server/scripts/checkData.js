import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Business from '../models/Business.js';
import AdminUser from '../models/AdminUser.js';
import Product from '../models/Product.js';

async function checkData() {
  try {
    await connectDB(process.env.MONGODB_URI);

    console.log('🔍 Verificando datos en la base de datos...\n');

    // Contar documentos
    const businessCount = await Business.countDocuments();
    const adminCount = await AdminUser.countDocuments();
    const productCount = await Product.countDocuments();

    console.log('📊 ESTADÍSTICAS:');
    console.log(`🏢 Negocios: ${businessCount}`);
    console.log(`👤 Admins: ${adminCount}`);
    console.log(`📦 Productos: ${productCount}`);

    // Mostrar detalles si hay datos
    if (businessCount > 0) {
      const business = await Business.findOne();
      console.log('\n📋 EJEMPLO DE NEGOCIO:');
      console.log('Nombre:', business.name);
      console.log('Email:', business.contactEmail);
      console.log('ID:', business._id);
    }

    if (adminCount > 0) {
      const admin = await AdminUser.findOne().populate('business');
      console.log('\n👤 EJEMPLO DE ADMIN:');
      console.log('Nombre:', admin.name);
      console.log('Email:', admin.email);
      console.log('Negocio:', admin.business.name);
      console.log('ID:', admin._id);
    }

    if (productCount > 0) {
      const products = await Product.find().limit(3).populate('business', 'name');
      console.log('\n📦 EJEMPLOS DE PRODUCTOS:');
      products.forEach((product, index) => {
        console.log(`${index + 1}. ${product.title} - $${product.price} (Stock: ${product.cant})`);
        console.log(`   Negocio: ${product.business.name}`);
        console.log(`   ID: ${product._id}\n`);
      });
    }

    if (businessCount === 0 || adminCount === 0 || productCount === 0) {
      console.log('\n❌ Faltan datos. Ejecuta: node server/scripts/seedData.js');
    } else {
      console.log('\n✅ Base de datos tiene datos de prueba!');
    }

    await mongoose.connection.close();

  } catch (error) {
    console.error('❌ Error verificando datos:', error);
    process.exit(1);
  }
}

checkData();