import React from 'react';

const TaskItem = ({ task, deleteTask, editTask }) => {

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4">
      <h2 className="text-lg text-black font-semibold mb-2">{task.title}</h2>
      <p className="text-black mb-2">{task.description}</p>
      <p className="text-black mb-2">Status: {task.completed ? 'Completed' : 'Not Completed'}</p>
      <div className="flex">
        <button
          onClick={() => editTask(task)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Edit
        </button>
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
