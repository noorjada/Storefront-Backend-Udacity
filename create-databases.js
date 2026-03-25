const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'NOor0123',
  database: 'postgres' // Connect to default postgres db
});

async function createDatabases() {
  const client = await pool.connect();
  try {
    // Check and create store database
    try {
      await client.query('CREATE DATABASE store');
      console.log('✓ Database "store" created');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('✓ Database "store" already exists');
      } else {
        throw err;
      }
    }

    // Check and create store_test database
    try {
      await client.query('CREATE DATABASE store_test');
      console.log('✓ Database "store_test" created');
    } catch (err) {
      if (err.code === '42P04') {
        console.log('✓ Database "store_test" already exists');
      } else {
        throw err;
      }
    }

    console.log('\n✓ All databases ready!');
  } finally {
    client.release();
    await pool.end();
  }
}

createDatabases().catch(err => {
  console.error('✗ Error:', err.message);
  process.exit(1);
});
