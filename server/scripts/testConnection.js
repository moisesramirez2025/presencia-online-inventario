import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';

async function testConnection() {
  try {
    console.log('🔌 Probando conexión a MongoDB...');
    await connectDB(process.env.MONGODB_URI);
    
    // Verificar si la base de datos existe
    const dbs = await mongoose.connection.db.admin().listDatabases();
    const dbExists = dbs.databases.some(db => db.name === mongoose.connection.db.databaseName);
    
    console.log(dbExists ? '✅ Base de datos existe' : '⚠️  Base de datos no existe, se creará automáticamente');
    console.log('📊 Base de datos:', mongoose.connection.db.databaseName);
    
    await mongoose.connection.close();
    console.log('✅ Conexión exitosa');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    process.exit(1);
  }
}

testConnection();