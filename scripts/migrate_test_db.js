// scripts/migrate_test_db.js
const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

async function run() {
  const client = new Client({
    host: process.env.TEST_PG_HOST || 'localhost',
    port: Number(process.env.TEST_PG_PORT || 5432),
    database: process.env.TEST_PG_DB || 'postgres',
    user: process.env.TEST_PG_USER || 'postgres',
    password: process.env.TEST_PG_PASSWORD || ''
  });
  await client.connect();
  try {
    const migrationsDir = path.join(__dirname, '..', 'supabase', 'migrations');
    const files = fs.readdirSync(migrationsDir).filter(f => f.endsWith('.sql')).sort();
    for (const f of files) {
      const sql = fs.readFileSync(path.join(migrationsDir, f), 'utf8');
      console.log('Applying', f);
      await client.query(sql);
    }
    console.log('Migrations applied');
  } catch (err) {
    console.error(err);
  } finally {
    await client.end();
  }
}

if (require.main === module) run();
module.exports = run;

