import { Outlet, Link } from "react-router-dom";
import { clearToken } from "../lib/auth";


export default function Layout() {
  return (
    <div className="layout">
      <header className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            ProjectManager
          </Link>

          <div className="navbar-actions">
            <button
              onClick={() => {
                clearToken();
                window.location.href = "/login";
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
