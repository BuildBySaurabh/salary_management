import "./EmployeeForm.css";
import {useEffect,useState} from "react";

const blank={employee_id:"",first_name:"",last_name:"",email:"",phone:"",job_title:"",department:"Engineering",country:"India",currency:"INR",salary:"",hire_date:"",status:"active",bank_name:"",bank_branch:"",bank_account_last4:"",notes:""};
const departments=["Engineering","Sales","HR","Finance","Marketing","Operations","Product","Legal","IT","Customer Success","Data","Administration"];
const countries=[["India","INR"],["USA","USD"],["UK","GBP"],["Germany","EUR"],["Canada","CAD"],["Australia","AUD"],["Japan","JPY"],["France","EUR"]];

export default function EmployeeForm({initialValues,onSubmit,submitting=false}){
 const [form,setForm]=useState(blank); const [error,setError]=useState("");
 useEffect(()=>setForm(initialValues?{...blank,...initialValues}:blank),[initialValues]);
 const set=(key,value)=>setForm(prev=>({...prev,[key]:value}));
 const submit=async e=>{e.preventDefault();setError("");if(!form.first_name||!form.last_name||!form.email||!form.employee_id||!form.job_title||!form.salary||!form.hire_date){setError("Please complete all required fields.");return;}try{await onSubmit(form);}catch(err){setError(err.response?.data?.detail||Object.values(err.response?.data||{})?.[0]?.[0]||"Could not save employee.");}};
 return <form className="employee-form" onSubmit={submit}>
  {error&&<div className="form-error">{error}</div>}
  <div className="form-section"><h3>Basic information</h3><p>Keep employee identity and contact details up to date.</p></div>
  <div className="form-grid">
   <label>Employee ID *<input value={form.employee_id} onChange={e=>set("employee_id",e.target.value)} placeholder="EMP10001"/></label>
   <label>Email *<input type="email" value={form.email} onChange={e=>set("email",e.target.value)} placeholder="employee@acme.com"/></label>
   <label>First name *<input value={form.first_name} onChange={e=>set("first_name",e.target.value)}/></label>
   <label>Last name *<input value={form.last_name} onChange={e=>set("last_name",e.target.value)}/></label>
   <label>Phone<input value={form.phone} onChange={e=>set("phone",e.target.value)}/></label>
   <label>Job title *<input value={form.job_title} onChange={e=>set("job_title",e.target.value)}/></label>
  </div>
  <div className="form-section"><h3>Organization</h3><p>Assign the employee to the correct business unit and location.</p></div>
  <div className="form-grid">
   <label>Department *<select value={form.department} onChange={e=>set("department",e.target.value)}>{departments.map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Country *<select value={form.country} onChange={e=>{const pair=countries.find(x=>x[0]===e.target.value);set("country",e.target.value);if(pair)set("currency",pair[1]);}}>{countries.map(([name])=><option key={name}>{name}</option>)}</select></label>
   <label>Currency *<select value={form.currency} onChange={e=>set("currency",e.target.value)}>{[...new Set(countries.map(x=>x[1]))].map(x=><option key={x}>{x}</option>)}</select></label>
   <label>Annual salary *<input type="number" min="0" step="0.01" value={form.salary} onChange={e=>set("salary",e.target.value)}/></label>
   <label>Hire date *<input type="date" value={form.hire_date} onChange={e=>set("hire_date",e.target.value)}/></label>
   <label>Status<select value={form.status} onChange={e=>set("status",e.target.value)}><option value="active">Active</option><option value="on_leave">On Leave</option><option value="inactive">Inactive</option></select></label>
  </div>
  <div className="form-section"><h3>Bank information</h3><p>Store only the bank, branch and last four digits for payroll identification.</p></div>
  <div className="form-grid">
   <label>Bank name<input value={form.bank_name} onChange={e=>set("bank_name",e.target.value)} placeholder="Bank name"/></label>
   <label>Bank branch<input value={form.bank_branch} onChange={e=>set("bank_branch",e.target.value)} placeholder="Branch"/></label>
   <label>Account last 4 digits<input maxLength="4" value={form.bank_account_last4} onChange={e=>set("bank_account_last4",e.target.value.replace(/\D/g,""))} placeholder="1234"/></label>
  </div>
  <label className="full-field">Notes<textarea rows="4" value={form.notes} onChange={e=>set("notes",e.target.value)} placeholder="Optional HR notes…"/></label>
  <div className="form-actions"><button className="button secondary" type="button" onClick={()=>window.history.back()}>Cancel</button><button className="button primary" disabled={submitting}>{submitting?"Saving…":"Save employee"}</button></div>
 </form>;
}
