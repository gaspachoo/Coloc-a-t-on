const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

async function createTable() {
  let client;
  try {
    client = await pool.connect();
    console.log("Connexion à la base de données réussie !");

    await client.query(createTableQuery);
    console.log("Table 'users' créée avec succès !");

  } catch (err) {
    console.error("Erreur lors de la création de la table :", err);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
    console.log("Connexion fermée.");
  }
}

createTable();