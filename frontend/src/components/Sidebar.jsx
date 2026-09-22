import "./Sidebar.css";
import { NavLink } from "react-router-dom";
import { BarChart3, ChevronLeft, FileBarChart, LayoutDashboard, Settings, UserPlus, Users, WalletCards } from "lucide-react";
import Logo from "./Logo";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/employees/new", label: "Add Employee", icon: UserPlus },
  { to: "/salary-sheets", label: "Salary Sheets", icon: WalletCards },
  { to: "/reports", label: "Reports", icon: FileBarChart },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  return <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
    <div className="sidebar-top"><Logo/><button className="icon-button sidebar-toggle" onClick={onToggle}><ChevronLeft size={17}/></button></div>
    <nav>{links.map(({ to, label, icon: Icon }) => <NavLink key={to} to={to} end={to === "/" || to === "/employees" || to === "/salary-sheets"} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}><Icon size={19}/><span>{label}</span></NavLink>)}</nav>
    <div className="sidebar-message"><BarChart3 size={28}/><p>Better data.<br/>Smarter decisions.<br/>A stronger tomorrow.</p></div>
  </aside>;
}
