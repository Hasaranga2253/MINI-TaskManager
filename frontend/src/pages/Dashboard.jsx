import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../auth.css";
import {
  createTask,
  deleteTask as removeTask,
  getConfiguredApiBaseUrls,
  getTasks,
  updateTask,
} from "../services/taskService";

function Dashboard() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(getErrorMessage(err, "Failed to load tasks."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError("Task title is required.");
      return;
    }

    try {
      setSubmitting(true);
      setError("");

      const createdTask = await createTask({
        title: trimmedTitle,
        description: description.trim(),
        isCompleted: false,
      });

      setTasks((currentTasks) => [createdTask, ...currentTasks]);
      setTitle("");
      setDescription("");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to add task."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleTitleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleAddTask();
    }
  };

  const toggleTask = async (task) => {
    try {
      setError("");

      const updatedTask = await updateTask(task.id, {
        title: task.title,
        description: task.description || "",
        isCompleted: !task.isCompleted,
      });

      setTasks((currentTasks) =>
        currentTasks.map((currentTask) => (currentTask.id === task.id ? updatedTask : currentTask))
      );
    } catch (err) {
      setError(getErrorMessage(err, "Failed to update task."));
    }
  };

  const deleteTask = async (id) => {
    try {
      setError("");
      await removeTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, "Failed to delete task."));
    }
  };

  const filteredTasks = useMemo(
    () =>
      tasks.filter((task) => {
        if (filter === "Completed") {
          return task.isCompleted;
        }

        return true;
      }),
    [filter, tasks]
  );

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-card">
          <div className="dashboard-header">
            <div>
              <h2 className="dashboard-title">Task Dashboard</h2>
              <p className="dashboard-text">Manage your tasks in a simple and smart way</p>
            </div>

            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>

          <div className="dashboard-body">
            <div className="task-form-card">
              <h3 className="section-title">Add New Task</h3>

              <input
                type="text"
                placeholder="Task title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                onKeyDown={handleTitleKeyDown}
                className="auth-input"
                disabled={submitting}
              />

              <textarea
                placeholder="Task description (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="task-textarea"
                disabled={submitting}
              />

              <button
                className="auth-button add-task-submit"
                onClick={handleAddTask}
                disabled={submitting}
              >
                {submitting ? "Adding..." : "Add Task"}
              </button>
            </div>

            {error && <div className="task-error-banner">{error}</div>}

            <div className="filter-row">
              <button
                className={filter === "All" ? "filter-btn active-filter" : "filter-btn"}
                onClick={() => setFilter("All")}
              >
                All
              </button>
              <button
                className={filter === "Completed" ? "filter-btn active-filter" : "filter-btn"}
                onClick={() => setFilter("Completed")}
              >
                Completed
              </button>
            </div>

            {loading ? (
              <div className="welcome-box">
                <h3>Loading...</h3>
                <p>Please wait while tasks are loading.</p>
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="welcome-box">
                <h3>No Tasks Found</h3>
                <p>Add a task to get started.</p>
              </div>
            ) : (
              <div className="task-list">
                {filteredTasks.map((task) => (
                  <div key={task.id} className="task-card">
                    <div className="task-content">
                      <h4 className={task.isCompleted ? "task-title completed" : "task-title"}>
                        {task.title}
                      </h4>

                      {task.description && (
                        <p className={task.isCompleted ? "task-desc completed" : "task-desc"}>
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="task-actions">
                      <button className="complete-btn" onClick={() => toggleTask(task)}>
                        {task.isCompleted ? "Undo" : "Done"}
                      </button>

                      <button className="delete-btn" onClick={() => deleteTask(task.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getErrorMessage(error, fallbackMessage) {
  if (error?.message === "Network Error" || error?.code === "ERR_NETWORK") {
    const attemptedUrls = error?.attemptedUrls || getConfiguredApiBaseUrls();

    return `Cannot reach the backend API. Checked: ${attemptedUrls.join(
      ", "
    )}. Make sure the backend is running and restart the frontend dev server after config changes.`;
  }

  const responseData = error?.response?.data;

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.errors) {
    const firstErrorGroup = Object.values(responseData.errors)[0];

    if (Array.isArray(firstErrorGroup) && firstErrorGroup.length > 0) {
      return firstErrorGroup[0];
    }
  }

  return fallbackMessage;
}

export default Dashboard;
