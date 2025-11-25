// Will welcome the routes functions for colocations
const express = require('express');
const pool = require('./db');

const app = express();
app.use(express.json());

// Exemple : Récupérer tous les utilisateurs
app.get('/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users');
    res.json(rows);
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs', err);
    res.status(500).send('Erreur serveur');
  }
});

// Exemple : Ajouter un utilisateur
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  try {
    const { rows } = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *',
      [name, email]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Erreur lors de l\'ajout de l\'utilisateur', err);
    res.status(500).send('Erreur serveur');
  }
});

app.listen(3000, () => {
  console.log('Serveur démarré sur le port 3000');
});
