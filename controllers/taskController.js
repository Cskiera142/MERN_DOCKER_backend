const Task = require("../models/Task");
const asyncHandler = require("express-async-handler");
const expressAsyncHandler = require("express-async-handler");

// @desc GET all tasks
// @desc GET /tasks
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find().lean();

  if (!tasks?.length) {
    return res.status(400).json({ message: "No tasks found" });
  }

  res.json(tasks);
});

// @desc Create task
// @desc POST /tasks
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
// @desc PATCH /tasks
const updateTask = asyncHandler(async (req, res) => {
  const { id, title, description, completed } = req.body;

  if ((!id, !title || !description || typeof completed !== "boolean")) {
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
  res.json(`'${updatedTask.title}' updated`);
});

// @desc Delete all tasks
// @desc DELETE /tasks
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Note ID required" });
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
