const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router;

router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);
router.patch("/", taskController.updateTask);
router.delete("/", taskController.deleteTask);

module.exports = router;
