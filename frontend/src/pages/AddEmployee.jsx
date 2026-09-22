import "./AddEmployee.css";
import {useState} from "react";
import {ArrowLeft} from "lucide-react";
import {Link,useNavigate} from "react-router-dom";
import EmployeeForm from "../components/EmployeeForm";
import api from "../services/api";
export default function AddEmployee(){
 const navigate=useNavigate();
 const[submitting,setSubmitting]=useState(false);
 const submit=async form=>{setSubmitting(true);
    try{const{data}=await api.post("/employees/",form);
    navigate(`/employees/${data.id}`);}finally{setSubmitting(false);}};
 return <div className="page add-employee-page">
    <div className="page-heading"><div>
        <Link className="back-link" to="/employees">
        <ArrowLeft size={15}/> Employees</Link>
        <h1>Add employee</h1>
        <span>Create a new salary record.</span>
        </div>
        </div>
        <section className="card">
            <EmployeeForm onSubmit={submit} submitting={submitting}/>
            </section>
        </div>;
}
