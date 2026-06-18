import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node scripts/hash-password.mjs <password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nGenerated bcrypt hash:');
console.log(hash);
console.log('\nAdd this to your .env file:');
console.log(`ADMIN_PASSWORD_HASH="${hash}"`);
