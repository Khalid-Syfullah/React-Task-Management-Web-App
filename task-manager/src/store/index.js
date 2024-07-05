import { configureStore } from '@reduxjs/toolkit';
import tasksReducer from '../features/tasksSlice';

// Configure the Redux store
// Here, we are combining different slices of state. In this case, we have only one slice: tasks.
export const store = configureStore({
  reducer: {
    tasks: tasksReducer, // The tasks slice reducer is assigned to the 'tasks' state
  },
});

// Export the configured store as the default export
export default store;