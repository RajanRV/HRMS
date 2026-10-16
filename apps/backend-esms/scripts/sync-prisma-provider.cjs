const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

function resolveProvider() {
  const explicit = String(process.env.DB_PROVIDER || '').toLowerCase().trim();
  if (explicit === 'postgresql' || explicit === 'postgres') return 'postgresql';
  if (explicit === 'sqlite') return 'sqlite';

  const url = String(process.env.DATABASE_URL || '');
  if (url.startsWith('postgres')) return 'postgresql';
  if (url.startsWith('file:')) return 'sqlite';
  return 'sqlite';
}

const provider = resolveProvider();
const src = path.join(__dirname, '../prisma/schema.prisma');
const dest = path.join(__dirname, '../prisma/schema.runtime.prisma');
const schema = fs.readFileSync(src, 'utf8').replace(
  /provider\s*=\s*"(sqlite|postgresql)"/,
  `provider = "${provider}"`
);

fs.writeFileSync(dest, schema);
console.log(`[prisma] Using provider=${provider}`);
