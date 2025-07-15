import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import pkg from 'pg';

const { Pool } = pkg;
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// Ensure table exists
(async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        todo_id SERIAL PRIMARY KEY,
        description TEXT NOT NULL
      )
    `);
    console.log('✅ Table initialized');
  } catch (err) {
    console.error('DB Init Error:', err.message);
  }
})();

// All API routes
app.get('/', (_req, res) => res.send('🟢 API is running'));

app.post('/todos', async (req, res) => {
  try {
    const { description } = req.body;
    const result = await pool.query(
      'INSERT INTO todos(description) VALUES($1) RETURNING *',
      [description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/todos', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY todo_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/todos/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos WHERE todo_id = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    await pool.query('UPDATE todos SET description = $1 WHERE todo_id = $2', [
      req.body.description,
      req.params.id
    ]);
    res.json({ message: 'Todo updated' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM todos WHERE todo_id = $1', [req.params.id]);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default app;
