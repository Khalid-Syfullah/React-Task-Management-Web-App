import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from '../config';

// Async thunk to fetch tasks from the server
export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await axios.get(API_URL + '/tasks');
  return response.data;
});

// Async thunk to add a new task to the server
export const addTask = createAsyncThunk('tasks/addTask', async (task) => {
  const response = await axios.post(API_URL + '/tasks', task);
  return response.data;
});

// Async thunk to update an existing task on the server
export const updateTask = createAsyncThunk('tasks/updateTask', async (task) => {
  const response = await axios.put(API_URL + `/tasks/${task._id}`, task);
  return response.data;
});

// Async thunk to delete a task from the server
export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id) => {
  await axios.delete(API_URL + `/tasks/${id}`);
  return id;
});

// Create a slice of the Redux store for tasks
const tasksSlice = createSlice({
  name: 'tasks',
  initialState: {
    tasks: [], // Array to store tasks
    status: 'idle', // Status of the async operations
    error: null, // Error message if any operation fails
    serverMessage: null, // Server messages for successful operations
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle the pending state for fetching tasks
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
      })
      // Handle the fulfilled state for fetching tasks
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.tasks = action.payload;
      })
      // Handle the rejected state for fetching tasks
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Handle the fulfilled state for adding a task
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
        state.serverMessage = { status: 'success', message: 'Task added successfully.' };
      })
      // Handle the fulfilled state for updating a task
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task._id === action.payload._id);
        state.tasks[index] = action.payload;
        state.serverMessage = { status: 'success', message: 'Task updated successfully.' };
      })
      // Handle the fulfilled state for deleting a task
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task._id !== action.payload);
        state.serverMessage = { status: 'success', message: 'Task deleted successfully.' };
      });
  },
});

// Export the reducer to be used in the store
export default tasksSlice.reducer;
