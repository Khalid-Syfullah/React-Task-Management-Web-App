import React from 'react';

const TaskItem = ({ task, deleteTask, editTask }) => {
  // Renders individual task item with title, description, and completion status
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg text-black font-semibold mb-2">{task.title}</h2> {/* Renders task title */}
      <p className="text-black mb-2">{task.description}</p> {/* Renders task description */}
      <p className="text-black mb-2">Status: {task.completed ? 'Completed' : 'Not Completed'}</p> {/* Renders task completion status */}
      <div className="flex">
        {/* Button to edit task, triggers editTask function with task object */}
        <button
          onClick={() => editTask(task)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Edit
        </button>
        {/* Button to delete task, triggers deleteTask function with task ID */}
        <button
          onClick={() => deleteTask(task._id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
