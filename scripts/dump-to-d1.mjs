// Reads the seeded local SQLite database and writes the same rows as SQL
// INSERTs for D1. Raw SELECT keeps the stored representation identical, so
// dates and decimals land in D1 exactly as Prisma wrote them locally.
import { PrismaClient } from '@prisma/client';
import fs from 'node:fs';

const db = new PrismaClient();

const TABLES = [
  'User', 'Business', 'Service', 'GasPrice', 'Station', 'Product',
  'Vehicle', 'AvailabilitySlot', 'Booking', 'Favorite', 'Review',
  'Order', 'OrderItem', 'Notification', 'AuditLog', 'PasswordResetToken',
];

const lit = (v) => {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'bigint') return String(v);
  if (typeof v === 'boolean') return v ? '1' : '0';
  if (v instanceof Date) return `'${v.toISOString()}'`;
  if (Buffer.isBuffer(v)) return `X'${v.toString('hex')}'`;
  return `'${String(v).replace(/'/g, "''")}'`;
};

let sql = '-- seed data exported from the local SQLite build\n';
let total = 0;

for (const t of TABLES) {
  let rows;
  try { rows = await db.$queryRawUnsafe(`SELECT * FROM "${t}"`); }
  catch (e) { console.log(`  skip ${t}: ${e.message.split('\n')[0].slice(0, 60)}`); continue; }
  if (!rows.length) { console.log(`  --   ${t}: empty`); continue; }
  const cols = Object.keys(rows[0]);
  for (const r of rows) {
    sql += `INSERT INTO "${t}" (${cols.map((c) => `"${c}"`).join(',')}) VALUES (${cols.map((c) => lit(r[c])).join(',')});\n`;
  }
  console.log(`  ok   ${t}: ${rows.length} row(s)`);
  total += rows.length;
}

fs.writeFileSync('migrations/0002_seed.sql', sql);
console.log(`\n${total} row(s) -> migrations/0002_seed.sql`);
await db.$disconnect();
