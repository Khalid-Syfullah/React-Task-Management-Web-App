import React, { useState, useEffect } from 'react';

const TaskForm = ({ addTask, updateTask, isEditing, currentTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (isEditing && currentTask) {
      setTitle(currentTask.title || '');
      setDescription(currentTask.description || '');
      setCompleted(currentTask.completed || false);
    } else {
      setTitle('');
      setDescription('');
      setCompleted(false);
    }
  }, [isEditing, currentTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const task = { title, description, completed };
    if (isEditing) {
      updateTask({ ...task, _id: currentTask._id });
    } else {
      addTask(task);
    }
    setTitle('');
    setDescription('');
    setCompleted(false);
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
