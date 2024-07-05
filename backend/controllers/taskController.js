const Task = require('../models/Task'); // Importing Task model

// Helper function to prepend timestamp to console log messages
const logWithTimestamp = (message, taskId = '') => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message} ${taskId}`);
};

// Controller function to get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetching all tasks from the database
    logWithTimestamp('Get tasks successful.'); // Logging success message
    res.json(tasks); // Sending tasks as JSON response
  } catch (err) {
    const errorMessage = `Error getting tasks: ${err.message}`; // Building error message
    logWithTimestamp(errorMessage); // Logging error message
    res.status(500).json({ message: err.message }); // Sending error message as JSON response with status 500 (Internal Server Error)
  }
};

// Controller function to get a task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); // Finding task by ID from database
    if (!task) { // Handling case where task is not found
      logWithTimestamp('Task not found.'); // Logging task not found message
      return res.status(404).json({ message: 'Task not found' }); // Sending 404 (Not Found) response with error message
    }
    logWithTimestamp('Get task by ID successful.', task._id); // Logging success message with task ID
    res.json(task); // Sending task as JSON response
  } catch (err) {
    const errorMessage = `Error getting task by ID: ${err.message}`; // Building error message
    logWithTimestamp(errorMessage); // Logging error message
    res.status(500).json({ message: err.message }); // Sending error message as JSON response with status 500 (Internal Server Error)
  }
};

// Controller function to create a new task
exports.createTask = async (req, res) => {
  const { title, description, completed } = req.body; // Destructuring task properties from request body
  const task = new Task({ title, description, completed }); // Creating a new Task instance

  try {
    const newTask = await task.save(); // Saving the new task to the database
    logWithTimestamp('Task created successfully.', newTask._id); // Logging success message with new task ID
    res.status(201).json(newTask); // Sending 201 (Created) response with newly created task as JSON
  } catch (err) {
    const errorMessage = `Error creating task: ${err.message}`; // Building error message
    logWithTimestamp(errorMessage); // Logging error message
    res.status(400).json({ message: err.message }); // Sending error message as JSON response with status 400 (Bad Request)
  }
};

// Controller function to update an existing task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); // Finding task by ID from database
    if (!task) { // Handling case where task is not found
      logWithTimestamp('Task not found.'); // Logging task not found message
      return res.status(404).json({ message: 'Task not found' }); // Sending 404 (Not Found) response with error message
    }

    // Updating task properties based on request body data or keeping existing values if not provided
    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.completed = req.body.completed !== undefined ? req.body.completed : task.completed;

    const updatedTask = await task.save(); // Saving updated task to the database
    logWithTimestamp('Task updated successfully.', updatedTask._id); // Logging success message with updated task ID
    res.json(updatedTask); // Sending updated task as JSON response
  } catch (err) {
    const errorMessage = `Error updating task: ${err.message}`; // Building error message
    logWithTimestamp(errorMessage); // Logging error message
    res.status(400).json({ message: err.message }); // Sending error message as JSON response with status 400 (Bad Request)
  }
};

// Controller function to delete a task by ID
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id); // Finding task by ID from database
    if (!task) { // Handling case where task is not found
      logWithTimestamp('Task not found.'); // Logging task not found message
      return res.status(404).json({ message: 'Task not found' }); // Sending 404 (Not Found) response with error message
    }

    await task.deleteOne(); // Deleting task from the database
    logWithTimestamp('Task deleted successfully.', task._id); // Logging success message with deleted task ID
    res.json({ message: 'Task deleted' }); // Sending success message as JSON response
  } catch (err) {
    const errorMessage = `Error deleting task: ${err.message}`; // Building error message
    logWithTimestamp(errorMessage); // Logging error message
    res.status(500).json({ message: err.message }); // Sending error message as JSON response with status 500 (Internal Server Error)
  }
};
