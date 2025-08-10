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

// CREATE: Add a new todo
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

// READ: Get all todos
app.get('/todos', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos ORDER BY todo_id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// READ: Get a single todo by id
app.get('/todos/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM todos WHERE todo_id = $1', [req.params.id]);
    res.json(result.rows[0] || {});
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// UPDATE: Update a todo by id
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

// DELETE: Delete a todo by id
app.delete('/todos/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM todos WHERE todo_id = $1', [req.params.id]);
    res.json({ message: 'Todo deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export default app;
