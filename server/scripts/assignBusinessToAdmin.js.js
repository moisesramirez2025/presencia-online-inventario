// server/scripts/assignBusinessToAdmin.js
import 'dotenv/config';
import mongoose from 'mongoose';
import Business from '../models/Business.js';
import AdminUser from '../models/AdminUser.js';

async function run() {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('Falta MONGODB_URI en server/.env');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a Mongo para migración');

    // 1) crea (o reutiliza) un negocio
    let biz = await Business.findOne({ name: 'Carpintería Ejemplo' });
    if (!biz) {
      biz = await Business.create({
        name: 'Carpintería Ejemplo',
        contactEmail: 'contacto@ejemplo.com'
      });
      console.log('Negocio creado:', biz._id.toString());
    } else {
      console.log('Negocio reutilizado:', biz._id.toString());
    }

    // 2) asigna el negocio a tu admin (ajusta el email si usas otro)
    const email = 'admin@ejemplo.com';
    const admin = await AdminUser.findOne({ email });
    if (!admin) {
      console.error(`No existe admin con el email ${email}. Crea uno o cambia el email del script.`);
      process.exit(1);
    }

    admin.business = biz._id;
    await admin.save();
    console.log(`OK: asignado business ${biz._id.toString()} a admin ${admin.email}`);
  } catch (e) {
    console.error('Error en migración:', e);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

run();
