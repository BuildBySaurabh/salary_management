import "./AppLayout.css";
import {useState} from "react";
import {Outlet} from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
export default function AppLayout(){
  const [collapsed,setCollapsed]=useState(false);
  return <div className={`app-shell ${collapsed?"sidebar-collapsed":""}`}>
    <Sidebar collapsed={collapsed} onToggle={()=>setCollapsed(v=>!v)}/>
      <main className="main-area">
        <Topbar/>
        <div className="page-content">
          <Outlet/>
          </div>
          </main>
          </div>;
}
