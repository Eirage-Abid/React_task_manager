# React_task_manager
A simple Task Management app with role-based access, built with React.js (frontend) and Node.js/Express (backend).
Admins can view all tasks; users can view only their own tasks. Supports CRUD operations, search, filter, and pagination.

# Tech Stack
Frontend: React.js, Axios, React Router
Backend: Node.js, Express.js 
Database: JSON file (db.json)

# Screenshots
<img width="880" height="436" alt="tm1" src="https://github.com/user-attachments/assets/c8816b6f-1024-4a91-a508-115edd1a081f" />

<img width="793" height="406" alt="tm2" src="https://github.com/user-attachments/assets/a337c3ce-2d4f-4cd8-a863-63ed0f47f74b" />

# API Endpoints
API Endpoints
GET /api/tasks – fetch tasks (supports filters, search, pagination)
GET /api/tasks/:id – fetch single task
POST /api/tasks – create task
PUT /api/tasks/:id – update task
DELETE /api/tasks/:id – delete task
For GET /api/tasks, pass userId and role to fetch tasks according to the user role.

# Installation and Running
Installation & Running

- Clone repo
git clone https://github.com/Eirage-Abid/React_task_manager
cd task-manager-app

- Backend
cd backend
npm install
node server.js
Server runs at: http://localhost:5000

- Frontend
cd ../frontend
npm install
npm start
App runs at: http://localhost:3000

