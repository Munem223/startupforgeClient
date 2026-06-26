import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Moon, Sun, UserRound, X } from "lucide-react";
import Logo from "./Logo";
import Avatar from "./Avatar";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  ["Home", "/"],
  ["Browse Startups", "/startups"],
  ["Browse Opportunities", "/opportunities"]
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const logout = async () => {
    await signOut();
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <header className="site-header">
      <nav className="container navbar">
        <Logo />
        <button className="mobile-menu-button" onClick={() => setOpen((value) => !value)} aria-label="Toggle navigation">
          {open ? <X /> : <Menu />}
        </button>
        <div className={`nav-panel ${open ? "is-open" : ""}`}>
          <div className="nav-links">
            {navItems.map(([label, to]) => (
              <NavLink key={to} to={to} onClick={() => setOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>{label}</NavLink>
            ))}
          </div>
          <div className="nav-actions">
            <button className="icon-button" onClick={toggleTheme} aria-label="Toggle color theme">
              {theme === "dark" ? <Sun size={19} /> : <Moon size={19} />}
            </button>
            {isAuthenticated ? (
              <div className="profile-menu-wrap">
                <button className="profile-trigger" onClick={() => setProfileOpen((value) => !value)}>
                  <Avatar user={user} size="sm" />
                  <span>{user.name?.split(" ")[0]}</span>
                </button>
                {profileOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-dropdown-head"><strong>{user.name}</strong><small>{user.email}</small></div>
                    <Link to="/dashboard" onClick={() => setProfileOpen(false)}><LayoutDashboard size={17} /> Dashboard</Link>
                    <Link to="/dashboard/profile" onClick={() => setProfileOpen(false)}><UserRound size={17} /> Profile</Link>
                    <button onClick={logout}><LogOut size={17} /> Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link className="button button-ghost button-sm" to="/login">Log in</Link>
                <Link className="button button-primary button-sm" to="/register">Join StartupForge</Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
