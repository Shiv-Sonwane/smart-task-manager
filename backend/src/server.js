const express = require("express");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// Middleware

app.use(cors());

app.use(express.json());

// Routes

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

// Test route

app.get("/", (req, res) => {
  res.json({
    message: "Smart Task Manager API is running",
  });
});

// Start server

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});