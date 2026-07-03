import 'dotenv/config';
import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdmin = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  const email = process.argv[2];
  if (!email) {
    console.log('Usage: node seed/seedAdmin.js user@email.com');
    process.exit(1);
  }

  const user = await User.findOne({ email });
  if (!user) {
    console.log('User not found');
    process.exit(1);
  }

  user.role = 'admin';
  await user.save();
  console.log(`${user.name} (${user.email}) is now an admin`);
  process.exit(0);
};

seedAdmin();