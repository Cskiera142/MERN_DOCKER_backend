const Task = require("../models/Task");
const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");

// @desc GET all tasks
// @desc GET /taskRoutes
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().lean();

  if (!tasks?.length) {
    return res.status(400).json({ message: "No tasks found" });
  }

  res.json(tasks);
});

// @desc Create task
// @desc POST /taskRoutes/:id
const createTask = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({ message: "All fields required" });
  }

  const task = await Task.create({ title, description });

  if (task) {
    res.status(201).json({ message: `New task ${title} created` });
  } else {
    res.status(400).json({ message: "Failed to create task" });
  }
});

// @desc update task
// @desc PATCH /taskRoutes/:id
const updateTask = asyncHandler(async (req, res) => {
  const { id, title, description, completed } = req.body;

  if (!id || !title || !description || typeof completed !== "boolean") {
    return res.status(400).json({ message: "All fields required" });
  }

  const task = await Task.findById(id).exec();

  if (!task) {
    return res.status(400).json({ message: "Task not found" });
  }

  task.title = title;
  task.description = description;
  task.completed = completed;

  const updatedTask = await task.save();
  res.json({ message: `'${updatedTask.title}' updated` });
});

// @desc delete task
// @desc DELETE /taskRoutes/:id
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Task ID required" });
  }

  const task = await Task.findById(id).exec();

  if (!task) {
    return res.status(400).json({ message: "Task not found" });
  }

  const result = await task.deleteOne();

  const reply = `Task '${result.title}' with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
