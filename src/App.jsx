import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Tasks from "../pages/Tasks";
import CreateTask from "../pages/CreateTask";
import EditTask from "../pages/editTask";  // Add this import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/tasks/create" element={<CreateTask />} />
        <Route path="/tasks/edit/:id" element={<EditTask />} />  {/* Add this route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;