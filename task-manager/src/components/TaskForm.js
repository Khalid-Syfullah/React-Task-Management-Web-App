import React, { useState, useEffect } from 'react';

const TaskForm = ({ addTask, updateTask, isEditing, currentTask }) => {
  // State variables to manage form input and state
  const [title, setTitle] = useState(''); // State to store the title of the task
  const [description, setDescription] = useState(''); // State to store the description of the task
  const [completed, setCompleted] = useState(false); // State to track if the task is completed (boolean)
  const [errors, setErrors] = useState({}); // State to store validation errors

  // Effect to update form fields when editing a task
  useEffect(() => {
    if (isEditing && currentTask) {
      setTitle(currentTask.title || ''); // Set title if editing and currentTask exists
      setDescription(currentTask.description || ''); // Set description if editing and currentTask exists
      setCompleted(currentTask.completed || false); // Set completed status if editing and currentTask exists
    } else {
      setTitle(''); // Reset title when not editing
      setDescription(''); // Reset description when not editing
      setCompleted(false); // Reset completed status when not editing
    }
  }, [isEditing, currentTask]); // Dependencies for useEffect

  // Form Validation function
  const validateForm = () => {
    const errors = {};
    if (!title.trim()) {
      errors.title = 'Title is required'; // Error message if title is empty
    }
    if (!description.trim()) {
      errors.description = 'Description is required'; // Error message if description is empty
    }
    return errors;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    const errors = validateForm(); // Validate form fields
    if (Object.keys(errors).length === 0) { // Check if there are no validation errors
      const task = { title, description, completed }; // Create task object from form data
      if (isEditing) {
        updateTask({ ...task, _id: currentTask._id }); // Update existing task if editing
      } else {
        addTask(task); // Add new task if not editing
      }
      setTitle(''); // Clear title input field after submission
      setDescription(''); // Clear description input field after submission
      setCompleted(false); // Reset completed status after submission
    } else {
      setErrors(errors); // Set validation errors to display error messages
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-lg mx-auto">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
          Title
        </label>
        <input
          id="title"
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Completed
        </label>
        <input
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(e.target.checked)}
          className="mr-2 leading-tight"
        />
        <span className="text-gray-700 text-sm">Mark as Completed</span>
      </div>
      <div className="flex items-center justify-center">
        <button
          type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          {isEditing ? 'Update Task' : 'Add Task'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
