import { Outlet, Link } from "react-router-dom";
import LogoutIcon from "@mui/icons-material/Logout";
import FolderIcon from "@mui/icons-material/Folder";
import { clearToken } from "./lib/auth";

export default function App() {
  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
             ProjectManager
          </Link>

          <button
            className="logout-btn"
            onClick={() => {
              clearToken();
              window.location.href = "/login";
            }}
          >
            <LogoutIcon />
          </button>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
