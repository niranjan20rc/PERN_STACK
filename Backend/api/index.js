import dotenv from 'dotenv';
dotenv.config();


import express from "express";
import cors from "cors";
import pkg from "pg";
import serverless from "serverless-http";

const { Pool } = pkg;
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// Initialize table
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS todos (
        todo_id SERIAL PRIMARY KEY,
        description TEXT NOT NULL
      )
    `);
    console.log("✅ Table initialized");
  } catch (err) {
    console.error("DB Init Error:", err.message);
  }
};
initDB();

const router = express.Router();

router.get("/", (req, res) => {
  res.send("🟢 API is running");
});

router.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const result = await pool.query(
      "INSERT INTO todos (description) VALUES ($1) RETURNING *",
      [description]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/todos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM todos ORDER BY todo_id DESC");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM todos WHERE todo_id = $1", [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    await pool.query("UPDATE todos SET description = $1 WHERE todo_id = $2", [description, id]);
    res.json({ message: "Todo updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM todos WHERE todo_id = $1", [id]);
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/api", router);

export default serverless(app);