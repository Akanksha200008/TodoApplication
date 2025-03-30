# TodoApp
A full-stack task management application built with React for the frontend and Node.js/Express for the backend, with MongoDB as the database. This modern web application allows users to organize their work by creating, managing, and tracking tasks with features like priority levels, due dates, and completion status.
# Features
•	User authentication (register, login, logout)
•	Create, view, edit, and delete tasks
•	Set task priorities (low, medium, high)
•	Set due dates for tasks
•	Mark tasks as completed/active
•	Filter tasks by status (all, active, completed)
•	Responsive design for desktop and mobile devices

# Prerequisites
Before you begin, ensure you have the following installed:
•	Node.js (v14.x or higher)
•	npm (v6.x or higher)
•	MongoDB (local installation or MongoDB Atlas account)
•	Git

# Installation
1. Clone the repository
2. Set up the backend
Navigate to the server directory and install dependencies:
cd server
npm install
Create a .env file in the server directory with the following variables:
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task-manager
JWT_SECRET=your_jwt_secret_key
Replace your_jwt_secret_key with a secure random string and update the MongoDB URI if you're using MongoDB Atlas.

3. Set up the frontend
Navigate to the client directory and install dependencies:
cd ../client
npm install

# Running the Application
1. Start the MongoDB server (if using local MongoDB)
mongod
2. Start the backend server
In the server directory: npm start

The server will run on http://localhost:5000 by default.
3. Start the frontend development server
In the client directory: npm start
The React application will run on http://localhost:3000 by default.
