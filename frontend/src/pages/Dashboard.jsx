import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import "../auth.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

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

          <div className="welcome-box">
            <h3>Welcome to Mini Task Manager</h3>
            <p>
              Your authentication is working successfully. Next, we will connect
              your real task API and show tasks here.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;