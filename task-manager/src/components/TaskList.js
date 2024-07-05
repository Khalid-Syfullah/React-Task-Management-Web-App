import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import './styles.css';
import { fetchTasks, addTask, updateTask, deleteTask } from '../features/tasksSlice';

const TaskList = () => {
  const dispatch = useDispatch();
  
  // Selectors to get tasks, status, and server messages from the Redux store
  const tasks = useSelector((state) => state.tasks.tasks);
  const status = useSelector((state) => state.tasks.status);
  const serverMessage = useSelector((state) => state.tasks.serverMessage);

  // Fetch tasks when the component mounts or when the status is 'idle'
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchTasks());
    }
  }, [status, dispatch]);

  // Local state to manage the task form dialog
  const [isAddingTask, setIsAddingTask] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [currentTask, setCurrentTask] = React.useState(null);

  // Function to handle adding a new task
  const handleAddTask = (task) => {
    dispatch(addTask(task));
    setIsAddingTask(false);
  };

  // Function to handle updating an existing task
  const handleUpdateTask = (task) => {
    dispatch(updateTask(task));
    setIsEditing(false);
    setCurrentTask(null);
  };

  // Function to handle deleting a task
  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  // Function to start editing a task
  const editTask = (task) => {
    setIsEditing(true);
    setIsAddingTask(true);
    setCurrentTask(task);
  };

  // Function to toggle the task form dialog for adding a new task
  const toggleAddTask = () => {
    setIsAddingTask((prev) => !prev);
    setIsEditing(false);
    setCurrentTask(null);
  };

  // Function to close the task form dialog
  const closeTaskDialog = () => {
    setIsAddingTask(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="fixed top-0 left-0 right-0 z-10 bg-white text-blue-500 shadow-md flex justify-between items-center px-4 py-2">
        <h1 className="text-3xl font-bold">Task Manager</h1>
        <button
          onClick={toggleAddTask}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Task
        </button>
      </div>

      {/* Display server messages */}
      {serverMessage && (
        <div className={`mb-4 p-2 rounded ${serverMessage.status === 'success' ? 'bg-green-200' : 'bg-red-200'}`}>
          {serverMessage.message}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Current Tasks</h2>
      <div className="grid gap-4">
        {/* Display loading, no tasks, or task list */}
        {status === 'loading' ? (
          <div className="bg-white text-black rounded-lg shadow-md p-4 text-center">
            <p>Loading...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-4 text-center text-gray-500">
            <p className="text-lg font-semibold">No tasks available.</p>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow-md p-4 transition duration-300 hover:bg-gray-100"
            >
              <TaskItem task={task} deleteTask={handleDeleteTask} editTask={editTask} />
            </div>
          ))
        )}
      </div>

      {/* Task form dialog for adding or editing tasks */}
      {isAddingTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 animate-fadeIn">
          <div className="bg-white shadow-md rounded-lg p-6 max-w-lg w-full">
            <h2 className="text-xl font-semibold">{isEditing ? 'Edit Task' : 'Add Task'}</h2>
            <TaskForm
              addTask={handleAddTask}
              updateTask={handleUpdateTask}
              isEditing={isEditing}
              currentTask={currentTask}
            />
            <button
              onClick={closeTaskDialog}
              className="mt-4 bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
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
