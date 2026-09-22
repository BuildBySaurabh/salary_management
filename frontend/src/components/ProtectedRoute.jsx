import "./ProtectedRoute.css";
import {Navigate,Outlet,useLocation} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
export default function ProtectedRoute(){
  const {user,loading}=useAuth(); const location=useLocation();
  if(loading)return <div className="screen-loader">Loading ACME Salary Manager…</div>;
  return user?<Outlet/>:<Navigate to="/login" replace state={{from:location.pathname}}/>;
}
