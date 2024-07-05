// Export the API_URL constant, which is assigned the value of the REACT_APP_API_URL environment variable.
// This allows the application to use different API endpoints for different environments (e.g., development, production) 
// by setting the REACT_APP_API_URL environment variable accordingly.
export const API_URL = process.env.REACT_APP_API_URL;
