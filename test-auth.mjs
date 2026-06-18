import bcrypt from 'bcryptjs';
import pkg from '@next/env';
const { loadEnvConfig } = pkg;

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const hash = process.env.ADMIN_PASSWORD_HASH;
console.log('Hash loaded from env:', hash);

const password = 'TEST@zxcv1';
const isValid = bcrypt.compareSync(password, hash);

console.log('Is valid:', isValid);
