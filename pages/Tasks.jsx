import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("pending");

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalTasks, setTotalTasks] = useState(0);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch tasks
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.get("/tasks", {
        params: {
          userId: user.id,
          role: user.role,
          status: filterStatus || undefined,
          q: searchQuery || undefined,
          _page: page,
          _limit: limit
        }
      });
      setTasks(res.data.tasks || []);
      setTotalTasks(res.data.total || 0);
    } catch (error) {
      alert("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, [page]);

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("Title is required");

    try {
      await api.post("/tasks", {
        title: newTitle,
        description: newDescription,
        status: newStatus,
        userId: user.id,
        role: user.role
      });
      setNewTitle("");
      setNewDescription("");
      setNewStatus("pending");
      alert("Task added successfully!");
      fetchTasks();
    } catch (error) {
      alert("Error adding task");
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`, {
        params: { userId: user.id, role: user.role }
      });
      alert("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      alert("Error deleting task");
    }
  };

  // Edit task
  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>Tasks</h2>

      {/* Search & Filter */}
      <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ flex: 1, padding: "8px" }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{ padding: "8px" }}
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={() => { setPage(1); fetchTasks(); }}
          style={{ padding: "8px 12px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px" }}
        >
          Apply
        </button>
      </div>

      {/* Add Task */}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Add New Task</h3>
        <form onSubmit={handleAddTask}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button
            type="submit"
            style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Add Task
          </button>
        </form>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <div>
          {tasks.map(task => (
            <div key={task.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px", borderRadius: "8px", backgroundColor: "#f9f9f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 10px 0" }}>{task.title}</h3>
                <p style={{ margin: "0 0 10px 0", color: "#666" }}>{task.description}</p>
                <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "12px", fontSize: "14px", fontWeight: "500",
                  backgroundColor: task.status === "done" ? "#d4edda" : task.status === "in-progress" ? "#fff3cd" : "#f8d7da",
                  color: task.status === "done" ? "#155724" : task.status === "in-progress" ? "#856404" : "#721c24"
                }}>{task.status}</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleEdit(task.id)} style={{ padding: "8px 12px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(task.id)} style={{ padding: "8px 12px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalTasks > limit && (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</button>
          <span>Page {page} of {Math.ceil(totalTasks / limit)}</span>
          <button disabled={page >= Math.ceil(totalTasks / limit)} onClick={() => setPage(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}




/*import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newStatus, setNewStatus] = useState("pending");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks", {
        params: { userId: user.id, role: user.role }
      });
      setTasks(res.data.tasks || []);
    } catch (error) {
      alert("Error loading tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { 
    fetchTasks(); 
  }, []);

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await api.delete(`/tasks/${taskId}`);
      alert("Task deleted successfully!");
      fetchTasks(); 
    } catch (error) {
      alert("Error deleting task");
    }
  };

  // Edit task
  const handleEdit = (taskId) => {
    navigate(`/tasks/edit/${taskId}`);
  };

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return alert("Title is required");

    try {
      await api.post("/tasks", {
        title: newTitle,
        description: newDescription,
        status: newStatus,
        userId: user.id,
        role: user.role
      });
      setNewTitle("");
      setNewDescription("");
      setNewStatus("pending");
      alert("Task added successfully!");
      fetchTasks(); 
    } catch (error) {
      alert("Error adding task");
    }
  };

  if (loading) return <div style={{ padding: "20px" }}>Loading...</div>;

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Tasks</h2>

      {}
      <div style={{ marginBottom: "30px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
        <h3>Add New Task</h3>
        <form onSubmit={handleAddTask}>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Title *"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <textarea
              placeholder="Description"
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              rows={3}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
            >
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
          <button
            type="submit"
            style={{ padding: "10px 20px", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}
          >
            Add Task
          </button>
        </form>
      </div>

      {}
      {tasks.length === 0 ? (
        <p>No tasks available</p>
      ) : (
        <div>
          {tasks.map(task => (
            <div key={task.id} style={{ border: "1px solid #ddd", padding: "15px", marginBottom: "15px", borderRadius: "8px", backgroundColor: "#f9f9f9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 10px 0" }}>{task.title}</h3>
                <p style={{ margin: "0 0 10px 0", color: "#666" }}>{task.description}</p>
                <span style={{ display: "inline-block", padding: "4px 12px", borderRadius: "12px", fontSize: "14px", fontWeight: "500", 
                  backgroundColor: task.status === "done" ? "#d4edda" : task.status === "in-progress" ? "#fff3cd" : "#f8d7da",
                  color: task.status === "done" ? "#155724" : task.status === "in-progress" ? "#856404" : "#721c24"
                }}>{task.status}</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <button onClick={() => handleEdit(task.id)} style={{ padding: "8px 12px", backgroundColor: "#2196F3", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Edit</button>
                <button onClick={() => handleDelete(task.id)} style={{ padding: "8px 12px", backgroundColor: "#f44336", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
*/

