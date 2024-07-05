import React from 'react';
import { Provider } from 'react-redux';
import TaskList from './components/TaskList';
import { store } from './store';
import './App.css';

// The root component of the React application
function App() {
  return (
    // The Provider component makes the Redux store available to any nested components that need access to the Redux state
    <Provider store={store}>
      <div className="App">
        <header className="App-header">
          {/* TaskList component displays the list of tasks and handles task operations */}
          <TaskList />
        </header>
      </div>
    </Provider>
  );
}

// Export the App component as the default export
export default App;
