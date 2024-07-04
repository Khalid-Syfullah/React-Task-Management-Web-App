import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import axios from 'axios';
import './styles.css';
import { API_URL } from '../config';

const TaskList = () => {

  const [tasks, setTasks] = useState([]); // State to store the list of tasks fetched from the server
  const [isAddingTask, setIsAddingTask] = useState(false); // State to manage the visibility of the add/edit task dialog
  const [isEditing, setIsEditing] = useState(false); // State to track if the user is currently editing a task
  const [currentTask, setCurrentTask] = useState(null); // State to store the details of the task being edited
  const [serverMessage, setServerMessage] = useState(null); // State to display messages from the server (e.g., success or error messages)
  const [isAddTaskDisabled, setIsAddTaskDisabled] = useState(false); // State to disable the Add Task button during API calls
  const [isLoading, setIsLoading] = useState(false); // State to indicate when API calls are in progress (loading indicator)

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setIsLoading(true); // Set loading state to true
    axios.get(API_URL + '/tasks')
      .then(response => {
        setTasks(response.data);
      })
      .catch(error => {
        console.error(error);
        setServerMessage({ status: 'error', message: 'Failed to fetch tasks from server.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsLoading(false); // Set loading state to false after API call completes
      });
  };

  // Add a new task to the server
  const addTask = (task) => {
    setIsAddTaskDisabled(true);  // Disable Add Task button during API call
    setIsLoading(true); // Set loading state to true
    axios.post(API_URL + '/tasks', task)
      .then(response => {
        setTasks([...tasks, response.data]);
        setIsAddingTask(false);
        setServerMessage({ status: 'success', message: 'Task added successfully.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000);
      })
      .catch(error => {
        console.error(error);
        setIsAddingTask(false);
        setServerMessage({ status: 'error', message: error.response.data.error || 'Failed to add task.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsAddTaskDisabled(false);
        setIsLoading(false); // Set loading state to false after API call completes
      });
  };

   // Update an existing task on the server
   const updateTask = (task) => {
    setIsAddTaskDisabled(true); // Disable Add Task button during API call
    setIsLoading(true); // Set loading state to true
    axios.put(API_URL + `/tasks/${task._id}`, task)
      .then(response => {
        const updatedTasks = tasks.map(t => t._id === task._id ? response.data : t);
        setTasks(updatedTasks);
        setIsEditing(false);
        setIsAddingTask(false);
        setCurrentTask(null);
        setServerMessage({ status: 'success', message: 'Task updated successfully.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000);
      })
      .catch(error => {
        console.error(error);
        setIsAddingTask(false);
        setServerMessage({ status: 'error', message: error.response.data.error || 'Failed to update task.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsAddTaskDisabled(false);
        setIsLoading(false); // Set loading state to false after API call completes
      });
  };

  // Delete a task from the server
  const deleteTask = (id) => {
    setIsAddTaskDisabled(true); 
    setIsLoading(true); // Set loading state to true
    axios.delete(API_URL + `/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task._id !== id));
        setServerMessage({ status: 'success', message: 'Task deleted successfully.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000);
      })
      .catch(error => {
        console.error(error);
        setServerMessage({ status: 'error', message: 'Failed to delete task.' });
        setTimeout(() => {
          setServerMessage(null);
        }, 3000);
      })
      .finally(() => {
        setIsAddTaskDisabled(false);
        setIsLoading(false); // Set loading state to false after API call completes
      });
  };



  const editTask = (task) => {
    setIsEditing(true);
    setIsAddingTask(true);
    setCurrentTask(task);
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
        {isLoading ? ( // Render loading indicator while loading
          <div className="bg-white text-black rounded-lg shadow-md p-4 text-center">
            <p>Loading...</p>
          </div>
        ) : tasks.length === 0 ? (
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
