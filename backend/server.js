const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Path to db.json
const DB_FILE = path.join(__dirname, "db.json");

// Helper functions to read/write db.json
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====
app.get("/api/tasks", (req, res) => {
  const db = readDB();
  const { userId, role, status, q, _page = 1, _limit = 5 } = req.query;

  let tasks = db.tasks;

  if (role !== "admin") {
    // User can only see their own tasks
    tasks = tasks.filter((t) => t.userId === Number(userId));
  }

  // Optional: status filter
  if (status) {
    tasks = tasks.filter((t) => t.status === status);
  }

  // Optional: search by title/description
  if (q) {
    tasks = tasks.filter(
      (t) =>
        t.title.toLowerCase().includes(q.toLowerCase()) ||
        t.description.toLowerCase().includes(q.toLowerCase())
    );
  }

  // Pagination
  const start = (_page - 1) * _limit;
  const paginated = tasks.slice(start, start + Number(_limit));

  res.json({ total: tasks.length, tasks: paginated });
});

// Get single task
app.get("/api/tasks/:id", (req, res) => {
  const db = readDB();
  const taskId = Number(req.params.id);
  const { role, userId } = req.query; // pass user info from frontend if needed

  const task = db.tasks.find((t) => t.id === taskId);

  if (!task) return res.status(404).json({ message: "Task not found" });

  // Role check
  if (role !== "admin" && task.userId !== Number(userId)) {
    return res.status(403).json({ message: "Access denied" });
  }

  res.json(task);
});

// Update task
app.put("/api/tasks/:id", (req, res) => {
  const db = readDB();
  const taskId = Number(req.params.id);
  const { role, userId } = req.body; // frontend must send these

  const taskIndex = db.tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1)
    return res.status(404).json({ message: "Task not found" });

  const task = db.tasks[taskIndex];

  if (role !== "admin" && task.userId !== Number(userId)) {
    return res.status(403).json({ message: "Access denied" });
  }

  db.tasks[taskIndex] = { ...task, ...req.body };
  writeDB(db);

  res.json(db.tasks[taskIndex]);
});

// Create new task
app.post("/api/tasks", (req, res) => {
  const db = readDB(); // FIX: Convert Date.now() to a string when creating the ID
  const newTask = { id: String(Date.now()), ...req.body };
  db.tasks.push(newTask);
  writeDB(db);
  res.status(201).json(newTask);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const db = readDB();
  const taskId = Number(req.params.id);
  const { role, userId } = req.query; // send from frontend

  const task = db.tasks.find((t) => t.id === taskId);
  if (!task) return res.status(404).json({ message: "Task not found" });

  if (role !== "admin" && task.userId !== Number(userId)) {
    return res.status(403).json({ message: "Access denied" });
  }

  db.tasks = db.tasks.filter((t) => t.id !== taskId);
  writeDB(db);

  res.json({ message: "Task deleted" });
});

// ===== START SERVER =====
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

// server.js
/**const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(express.json());

// Path to db.json
const DB_FILE = path.join(__dirname, "db.json");

// Helper functions to read/write db.json
function readDB() {
  return JSON.parse(fs.readFileSync(DB_FILE, "utf-8"));
}
function writeDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// ===== ROUTES =====

// Get all tasks
app.get("/api/tasks", (req, res) => {
  const db = readDB();
  res.json(db.tasks);
});

// Get single task
app.get("/api/tasks/:id", (req, res) => {
  const db = readDB(); // FIX: Compare ID as a string, as req.params.id is always a string // Ensure t.id is also treated as a string for comparison consistency
  const task = db.tasks.find((t) => String(t.id) === req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });
  res.json(task);
});

// Create new task
app.post("/api/tasks", (req, res) => {
  const db = readDB(); // FIX: Convert Date.now() to a string when creating the ID
  const newTask = { id: String(Date.now()), ...req.body };
  db.tasks.push(newTask);
  writeDB(db);
  res.status(201).json(newTask);
});

// Update task
app.put("/api/tasks/:id", (req, res) => {
  const db = readDB(); // FIX: Compare ID as a string
  const index = db.tasks.findIndex((t) => String(t.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Task not found" }); // Ensure the ID remains the original type (string) during update merge

  db.tasks[index] = { ...db.tasks[index], ...req.body };
  writeDB(db);
  res.json(db.tasks[index]);
});

// Delete task
app.delete("/api/tasks/:id", (req, res) => {
  const db = readDB(); // FIX: Compare ID as a string
  const index = db.tasks.findIndex((t) => String(t.id) === req.params.id);
  if (index === -1) return res.status(404).json({ message: "Task not found" });

  const deleted = db.tasks.splice(index, 1);
  writeDB(db);
  res.json(deleted[0]);
});

// ===== START SERVER =====
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
**/
