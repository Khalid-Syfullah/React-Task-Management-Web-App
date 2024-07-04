const Task = require('../models/Task');

// Helper function to prepend timestamp to console log messages
const logWithTimestamp = (message, taskId = '') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message} ${taskId}`);
};

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    logWithTimestamp('Get tasks successful.');
    res.json(tasks);
  } catch (err) {
    const errorMessage = `Error getting tasks: ${err.message}`;
    logWithTimestamp(errorMessage);
    res.status(500).json({ message: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      logWithTimestamp('Task not found.');
      return res.status(404).json({ message: 'Task not found' });
    }
    logWithTimestamp('Get task by ID successful.', task._id);
    res.json(task);
  } catch (err) {
    const errorMessage = `Error getting task by ID: ${err.message}`;
    logWithTimestamp(errorMessage);
    res.status(500).json({ message: err.message });
  }
};

exports.createTask = async (req, res) => {
  const { title, description, completed } = req.body;
  const task = new Task({ title, description, completed });

  try {
    const newTask = await task.save();
    logWithTimestamp('Task created successfully.', newTask._id);
    res.status(201).json(newTask);
  } catch (err) {
    const errorMessage = `Error creating task: ${err.message}`;
    logWithTimestamp(errorMessage);
    res.status(400).json({ message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      logWithTimestamp('Task not found.');
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    const updatedTask = await task.save();
    logWithTimestamp('Task updated successfully.', updatedTask._id);
    res.json(updatedTask);
  } catch (err) {
    const errorMessage = `Error updating task: ${err.message}`;
    logWithTimestamp(errorMessage);
    res.status(400).json({ message: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      logWithTimestamp('Task not found.');
      return res.status(404).json({ message: 'Task not found' });
    }

    await task.deleteOne();
    logWithTimestamp('Task deleted successfully.', task._id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    const errorMessage = `Error deleting task: ${err.message}`;
    logWithTimestamp(errorMessage);
    res.status(500).json({ message: err.message });
  }
};
