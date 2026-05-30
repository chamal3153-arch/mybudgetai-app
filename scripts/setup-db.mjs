import pg from 'pg'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { Client } = pg
const __dirname = dirname(fileURLToPath(import.meta.url))

const DB_PASSWORD = process.argv[2]
if (!DB_PASSWORD) {
  console.error('Usage: node scripts/setup-db.mjs YOUR_DB_PASSWORD')
  process.exit(1)
}

const client = new Client({
  host: 'db.lzxaaztomihxxrpqcgpv.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
})

const sql = readFileSync(join(__dirname, '..', 'supabase-setup.sql'), 'utf8')

try {
  await client.connect()
  console.log('✓ Connected to Supabase Postgres')
  await client.query(sql)
  console.log('✓ All tables created successfully!')
  console.log('  - profiles')
  console.log('  - plans')
  console.log('  - purchases')
  await client.end()
} catch (err) {
  console.error('✗ Error:', err.message)
  await client.end().catch(() => {})
  process.exit(1)
}
