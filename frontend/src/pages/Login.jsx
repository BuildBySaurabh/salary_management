import "./Login.css";
import {useState} from "react";
import {Link,Navigate,useLocation,useNavigate} from "react-router-dom";
import {useAuth} from "../context/AuthContext";
import Logo from "../components/Logo";

export default function Login(){
 const{user,login}=useAuth();const navigate=useNavigate();const location=useLocation();
 const[email,setEmail]=useState("");const[password,setPassword]=useState("");const[error,setError]=useState("");const[loading,setLoading]=useState(false);
 if(user)return <Navigate to={location.state?.from||"/"} replace/>;
 const submit=async e=>{e.preventDefault();setLoading(true);setError("");try{await login(email,password);
    navigate(location.state?.from||"/");}
    catch{setError("Email or password is incorrect.");}
    finally{setLoading(false);}};
 return <AuthShell title="Welcome back" subtitle="Sign in to manage ACME employee salary data.">
    <form onSubmit={submit} className="auth-form">{error&&<div className="form-error">{error}</div>}
    <label>Work email<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="sarah@acme.com" required/></label>
    <label>Password<input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required/></label>
    <button className="button primary auth-submit" disabled={loading}>{loading?"Signing in…":"Sign in"}</button>
    <p className="auth-switch">New HR manager? <Link to="/register">Create an account</Link>
    </p>
    </form>
    </AuthShell>;
}
function AuthShell({title,subtitle,children}){return <div className="auth-shell">
    <div className="auth-art"><Logo/>
    <div className="auth-copy">
        <h1>Better data.<br/>Smarter decisions.</h1>
        <p>Manage compensation data clearly across teams, countries and currencies.</p>
        </div>
    </div>
    <div className="auth-panel">
        <div className="auth-content">
            <div className="mobile-brand">
                <Logo/>
            </div>
            <h1>{title}</h1>
            <p>{subtitle}</p>{children}</div>
            </div>
            </div>;
}
