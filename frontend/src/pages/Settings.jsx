import "./Settings.css";
import {useState} from "react";
import {useAuth} from "../context/AuthContext";
export default function Settings(){
 const{user,logout}=useAuth();const[saved,setSaved]=useState(false);
 return <div className="page"><div className="page-heading"><div><p className="eyebrow">Workspace</p><h1>Settings</h1><span>Manage your HR manager profile and session.</span></div></div><div className="settings-grid"><section className="card settings-card"><h3>Profile</h3><p>Your account details used for the HR workspace.</p><label>Full name<input value={user?.name||""} readOnly/></label><label>Work email<input value={user?.email||""} readOnly/></label><button className="button secondary" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}}>{saved?"Saved":"Save profile"}</button></section><section className="card settings-card"><h3>Security</h3><p>End the current session on this device.</p><button className="button danger" onClick={logout}>Sign out</button></section></div></div>;
}
