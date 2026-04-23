import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Dashboard</h2>
      <p>You are logged in successfully.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;