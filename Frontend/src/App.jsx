// App.js - React frontend for PERN Todo List

import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/todos"; // ✅ Update this if deploying backend

function App() {
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);

  // 🔄 Fetch todos from backend
  const fetchTodos = async () => {
    try {
      const res = await axios.get(API_URL);
      setTodos(res.data);
    } catch (err) {
      console.error("Error fetching todos:", err.message);
    }
  };

  // ➕ Add a new todo
  const addTodo = async () => {
    if (!description.trim()) return;
    try {
      await axios.post(API_URL, { description });
      setDescription("");
      fetchTodos();
    } catch (err) {
      console.error("Error adding todo:", err.message);
    }
  };

  // ❌ Delete a todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTodos();
    } catch (err) {
      console.error("Error deleting todo:", err.message);
    }
  };

  // ✏️ Update a todo (inline example)
  const updateTodo = async (id, newDesc) => {
    try {
      await axios.put(`${API_URL}/${id}`, { description: newDesc });
      fetchTodos();
    } catch (err) {
      console.error("Error updating todo:", err.message);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div style={styles.container}>
      <h1>PERN ToDo List ✅</h1>

      <div style={styles.inputBox}>
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add a task..."
          style={styles.input}
        />
        <button onClick={addTodo} style={styles.addBtn}>Add</button>
      </div>

      <ul style={styles.todoList}>
        {todos.map((todo) => (
          <li key={todo.todo_id} style={styles.todoItem}>
            <input
              defaultValue={todo.description}
              onBlur={(e) => updateTodo(todo.todo_id, e.target.value)}
              style={styles.todoText}
            />
            <button onClick={() => deleteTodo(todo.todo_id)} style={styles.delBtn}>
              ❌
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// 💅 Simple inline styling
const styles = {
  container: { padding: 30, maxWidth: 600, margin: "auto", fontFamily: "sans-serif" },
  inputBox: { display: "flex", marginBottom: 20 },
  input: { flex: 1, padding: 10, fontSize: 16 },
  addBtn: { padding: "10px 20px", marginLeft: 10, cursor: "pointer" },
  todoList: { listStyle: "none", padding: 0 },
  todoItem: {
    display: "flex",
    alignItems: "center",
    marginBottom: 10,
    borderBottom: "1px solid #ccc",
    paddingBottom: 5,
  },
  todoText: { flex: 1, padding: 8, fontSize: 16 },
  delBtn: { marginLeft: 10, cursor: "pointer", background: "none", border: "none", fontSize: 20 },
};

export default App;
