import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  AppWindow, BriefcaseBusiness, Building2, ChevronLeft, CreditCard, FileUser, Home,
  LayoutDashboard, LogOut, Menu, PlusCircle, Rocket, UserRound, Users, X
} from "lucide-react";
import Logo from "../components/Logo";
import Avatar from "../components/Avatar";
import { useAuth } from "../context/AuthContext";

const linksByRole = {
  founder: [
    ["Overview", "/dashboard", LayoutDashboard, true],
    ["My Startup", "/dashboard/my-startup", Building2],
    ["Add Opportunity", "/dashboard/add-opportunity", PlusCircle],
    ["Manage Opportunities", "/dashboard/opportunities", BriefcaseBusiness],
    ["Applications", "/dashboard/applications", FileUser]
  ],
  collaborator: [
    ["Overview", "/dashboard", LayoutDashboard, true],
    ["Browse Opportunities", "/opportunities", AppWindow],
    ["My Applications", "/dashboard/my-applications", FileUser]
  ],
  admin: [
    ["Overview", "/dashboard", LayoutDashboard, true],
    ["Manage Users", "/dashboard/users", Users],
    ["Manage Startups", "/dashboard/startups", Rocket],
    ["Transactions", "/dashboard/transactions", CreditCard]
  ]
};

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const links = linksByRole[user?.role] || [];

  const logout = async () => { await signOut(); navigate("/"); };

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${sidebarOpen ? "is-open" : ""}`}>
        <div className="sidebar-top"><Logo /><button className="sidebar-close" onClick={() => setSidebarOpen(false)}><X /></button></div>
        <div className="sidebar-user"><Avatar user={user} /><div><strong>{user?.name}</strong><span>{user?.role}</span></div></div>
        <nav className="sidebar-nav">
          {links.map(([label, to, Icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? "active" : ""}>
              <Icon size={19} /><span>{label}</span>
            </NavLink>
          ))}
          <NavLink to="/dashboard/profile" onClick={() => setSidebarOpen(false)} className={({ isActive }) => isActive ? "active" : ""}><UserRound size={19} /><span>Profile</span></NavLink>
        </nav>
        <div className="sidebar-bottom">
          <NavLink to="/"><Home size={18} /> Back to site</NavLink>
          <button onClick={logout}><LogOut size={18} /> Logout</button>
        </div>
      </aside>
      {sidebarOpen && <button className="sidebar-overlay" onClick={() => setSidebarOpen(false)} aria-label="Close sidebar" />}
      <section className="dashboard-main">
        <header className="dashboard-topbar">
          <button className="dashboard-menu" onClick={() => setSidebarOpen(true)}><Menu /></button>
          <div><span className="topbar-kicker">StartupForge workspace</span><strong>Welcome back, {user?.name?.split(" ")[0]}</strong></div>
          <button className="button button-ghost button-sm desktop-back" onClick={() => navigate(-1)}><ChevronLeft size={17} /> Back</button>
        </header>
        <div className="dashboard-content"><Outlet /></div>
      </section>
    </div>
  );
}
