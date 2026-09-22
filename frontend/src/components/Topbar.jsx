import "./Topbar.css";
import { Bell, Search, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Topbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const submitSearch = (event) => {
    event.preventDefault();
    const value = search.trim();
    navigate(value ? `/employees?search=${encodeURIComponent(value)}` : "/employees");
  };

  return (
    <header className="topbar">
      <form className="global-search" onSubmit={submitSearch}>
        <Search size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search employees, phone numbers, departments…"
        />
        <kbd>Enter</kbd>
      </form>
      <div className="topbar-right">
        <button className="notification"><Bell size={20} /><span /></button>
        <div className="user-menu">
          <div className="avatar">{(user?.name || "HR").slice(0, 1).toUpperCase()}</div>
          <div className="user-copy"><strong>{user?.name || "HR Manager"}</strong><small>HR Manager</small></div>
          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
