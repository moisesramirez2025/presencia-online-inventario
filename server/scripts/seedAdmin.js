import 'dotenv/config';
import { connectDB } from '../config/db.js';
import AdminUser from '../models/AdminUser.js';

async function main() {
  await connectDB(process.env.MONGODB_URI);
  const exists = await AdminUser.findOne({ email: process.env.ADMIN_EMAIL });
  if (exists) {
    console.log('ℹAdmin ya existe:', exists.email);
    process.exit(0);
  }
  const user = await AdminUser.create({
    name: process.env.ADMIN_NAME,
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD
  });
  console.log('Admin creado:', user.email);
  process.exit(0);
}
main().catch(err => { console.error(err); process.exit(1); });
