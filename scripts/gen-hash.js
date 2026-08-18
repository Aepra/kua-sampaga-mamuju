import bcrypt from 'bcryptjs';

async function generateHashes() {
  const adminHash = await bcrypt.hash('Admin123!', 12);
  const userHash = await bcrypt.hash('User123!', 12);
  console.log('Admin hash:', adminHash);
  console.log('User hash:', userHash);
}

generateHashes();
