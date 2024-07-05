const express = require('express'); // Importing Express.js framework
const mongoose = require('mongoose'); // Importing mongoose for MongoDB interaction
const cors = require('cors'); 
require('dotenv').config();

const app = express(); // Creating an instance of Express application

app.use(cors()); // Adding CORS middleware to allow cross-origin requests
app.use(express.json()); // Parsing incoming request bodies as JSON

mongoose.connect(process.env.MONGODB_URI) // Connecting to MongoDB Atlas using the provided URI from environment variables
  .then(() => console.log('MongoDB connected')) 
  .catch(err => console.log(err)); 

const taskRouter = require('./routes/taskRoutes'); // Importing router module for tasks
app.use('/tasks', taskRouter); 

const PORT = process.env.PORT || 5000; // Setting the server port to the environment variable PORT or defaulting to 5000
app.listen(PORT, () => { 
  console.log(`Server is running on port ${PORT}`); 
});
