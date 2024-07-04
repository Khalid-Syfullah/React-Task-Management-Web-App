import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import axios from 'axios';
import './styles.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [serverMessage, setServerMessage] = useState(null);
  const [isAddTaskDisabled, setIsAddTaskDisabled] = useState(false); // State to disable Add Task button

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:5000/tasks')
      .then(response => setTasks(response.data))
      .catch(error => console.error(error));
  };

  const addTask = (task) => {
    setIsAddTaskDisabled(true); // Disable Add Task button during API call
    axios.post('http://localhost:5000/tasks', task)
      .then(response => {
        setTasks([...tasks, response.data]);
        setIsAddingTask(false); // Close dialog after adding task
        setServerMessage({ status: 'success', message: 'Task added successfully.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000); // Clear message after 3 seconds
      })
      .catch(error => {
        console.error(error);
        setServerMessage({ status: 'error', message: 'Failed to add task.' });
      })
      .finally(() => {
        setIsAddTaskDisabled(false); // Re-enable Add Task button after API call completes
      });
  };

  const updateTask = (task) => {
    setIsAddTaskDisabled(true); // Disable Add Task button during API call
    axios.put(`http://localhost:5000/tasks/${task._id}`, task)
      .then(response => {
        const updatedTasks = tasks.map(t => t._id === task._id ? response.data : t);
        setTasks(updatedTasks);
        setIsEditing(false);
        setIsAddingTask(false);
        setCurrentTask(null);
        setServerMessage({ status: 'success', message: 'Task updated successfully.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000); // Clear message after 3 seconds
      })
      .catch(error => {
        console.error(error);
        setServerMessage({ status: 'error', message: 'Failed to update task.' });
      })
      .finally(() => {
        setIsAddTaskDisabled(false); // Re-enable Add Task button after API call completes
      });
  };

  const deleteTask = (id) => {
    setIsAddTaskDisabled(true); // Disable Add Task button during API call
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
        setServerMessage({ status: 'success', message: 'Task deleted successfully.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000); // Clear message after 3 seconds
      })
      .catch(error => {
        console.error(error);
        setServerMessage({ status: 'error', message: 'Failed to delete task.' });
      })
      .finally(() => {
        setIsAddTaskDisabled(false); // Re-enable Add Task button after API call completes
      });
  };

  const editTask = (task) => {
    setIsEditing(true);
    setIsAddingTask(true);
    setCurrentTask(task);
    console.log("Editing task:", task);
  };

  const toggleAddTask = () => {
    setIsAddingTask(prev => !prev); // Toggle add task dialog state
    setIsEditing(false);
    setCurrentTask(null);
    setIsAddTaskDisabled(true); // Disable Add Task button when opening dialog
  };

  const closeTaskDialog = () => {
    setIsAddingTask(false);
    setIsAddTaskDisabled(false); // Re-enable Add Task button when closing dialog
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">

      {/* Navbar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white text-blue-500 shadow-md flex justify-between items-center px-4 py-2">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <button
          onClick={toggleAddTask}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 ${isAddTaskDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isAddTaskDisabled}
        >
          Add Task
        </button>
      </div>

      {/* Display Server Messages */}
      {serverMessage && (
        <div className={`mb-4 p-2 rounded ${serverMessage.status === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
          {serverMessage.message}
        </div>
      )}

      {/* Current Task List */}
      <h2 className="text-xl font-semibold mb-4">Current Tasks</h2>
      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
            <p className="text-lg font-semibold">No tasks available.</p>
          </div>
        ) : (
          tasks.map(task => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow-md p-4 transition duration-300 hover:bg-gray-100"
            >
              <TaskItem task={task} deleteTask={deleteTask} editTask={editTask} />
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Task Dialog */}
      {isAddingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 animate-fadeIn">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit Task' : 'Add Task'}</h2>
            <TaskForm
              addTask={addTask}
              updateTask={updateTask}
              isEditing={isEditing}
              currentTask={currentTask}
            />
            <button
              onClick={closeTaskDialog}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
