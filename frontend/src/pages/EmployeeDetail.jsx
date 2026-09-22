import "./EmployeeDetail.css";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, Pencil, Trash2, FileText, RefreshCw } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const statusLabel = { active: "Active", on_leave: "On Leave", inactive: "Inactive" };
const departments = ["Engineering","Sales","HR","Finance","Marketing","Operations","Product","Legal","IT","Customer Success","Data","Administration"];
const countries = [["India","INR"],["USA","USD"],["UK","GBP"],["Germany","EUR"],["Canada","CAD"],["Australia","AUD"],["Japan","JPY"],["France","EUR"]];

function downloadBlob(blob, filename) { const url=URL.createObjectURL(blob); const link=document.createElement("a"); link.href=url; link.download=filename; link.click(); URL.revokeObjectURL(url); }

export default function EmployeeDetail({ edit=false }) {
  const { id } = useParams(); const navigate = useNavigate();
  const [employee,setEmployee]=useState(null); const [loading,setLoading]=useState(true); const [saving,setSaving]=useState(false); const [error,setError]=useState("");
  const [salaryMonth,setSalaryMonth]=useState(()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`});
  const [generating,setGenerating]=useState(false); const [message,setMessage]=useState("");

  const load = () => { setLoading(true); api.get(`/employees/${id}/`).then(r=>setEmployee(r.data)).catch(()=>setError("Employee not found.")).finally(()=>setLoading(false)); };
  useEffect(()=>{load();},[id]);

  const update = async e => { e.preventDefault(); setSaving(true); setError(""); try { await api.patch(`/employees/${id}/`, employee); navigate(`/employees/${id}`); } catch(err) { setError(Object.values(err.response?.data||{})?.[0]?.[0]||err.response?.data?.detail||"Could not save changes."); } finally { setSaving(false); } };
  const remove = async () => { if(window.confirm("Delete this employee? This cannot be undone.")){ await api.delete(`/employees/${id}/`); navigate("/employees"); } };
  const generateSlip = async () => { setGenerating(true); setMessage(""); setError(""); try { const response=await api.post(`/employees/${id}/generate-salary-slip/`,{month:salaryMonth},{responseType:"blob"}); downloadBlob(response.data,`salary-slip-${employee.employee_id}-${salaryMonth}.pdf`); setMessage(`Salary slip generated for ${salaryMonth}.`); load(); } catch { setError("Could not generate the salary slip."); } finally { setGenerating(false); } };
  const downloadExisting = async record => { const response=await api.get(`/salary-records/${record.id}/slip/`,{responseType:"blob"}); downloadBlob(response.data,`salary-slip-${employee.employee_id}-${record.pay_month.slice(0,7)}.pdf`); };

  if(loading)return <div className="loading-panel">Loading employee…</div>;
  if(error||!employee)return <div className="page-error">{error}</div>;

  if(edit) return <div className="page">
    <div className="page-heading">
      <div>
        <Link className="back-link" to={`/employees/${id}`}>
        <ArrowLeft size={15}/> Employee details</Link>
        <h1>Edit employee</h1>
        <span>Update employee, bank and compensation information.</span>
        </div>
        </div>
        <form className="card employee-form" onSubmit={update}>{error&&<div className="form-error">{error}</div>}<div className="form-section">
          <h3>Employee information</h3>
          </div>
          <div className="form-grid">{[["first_name","First name"],["last_name","Last name"],["email","Email"],["phone","Phone"],["job_title","Job title"],["department","Department"],["country","Country"],["currency","Currency"],["salary","Annual CTC"],["hire_date","Hire date"],["status","Status"],["bank_name","Bank name"],["bank_branch","Bank branch"],["bank_account_last4","Bank account last 4"]].map(([key,label])=><label key={key}>{label}<input type={key==="hire_date"?"date":"text"} value={employee[key]??""} onChange={e=>setEmployee({...employee,[key]:e.target.value})}/>
          </label>)}</div>
          <div className="form-actions">
            <button type="button" className="button secondary" onClick={()=>navigate(`/employees/${id}`)}>Cancel</button>
            <button className="button primary" disabled={saving}>{saving?"Saving…":"Save changes"}</button>
            </div>
            </form>
            </div>;

  return <div className="page employee-detail-page">
    <div className="page-heading">
      <div>
        <Link className="back-link" to="/employees">
        <ArrowLeft size={15}/> Employees</Link>
        <h1>{employee.full_name}</h1>
        <span>{employee.job_title} · {employee.department}</span>
        </div>
        <div className="heading-actions">
          <Link className="button secondary" to={`/employees/${id}/edit`}><Pencil size={16}/> Edit</Link>
          <button className="button danger" onClick={remove}><Trash2 size={16}/> Delete</button>
          </div>
          </div>
    {message&&<div className="success-box">{message}</div>}{error&&<div className="form-error">{error}</div>}
    <div className="detail-grid">
      <section className="card profile-card">
        <div className="large-avatar">{employee.first_name[0]}{employee.last_name[0]}</div>
        <h2>{employee.full_name}</h2>
        <p>{employee.employee_id}</p>
        <span className={`status ${employee.status}`}>{statusLabel[employee.status]}</span>
        <div className="profile-meta"><span>{employee.email}</span>
        <span>{employee.phone||"No phone"}</span>
        </div>
        </section>
      <section className="card detail-card">
        <h3>Employee & bank information</h3>
        <div className="detail-list">{[["Email",employee.email],["Phone",employee.phone||"—"],["Job title",employee.job_title],["Department",employee.department],["Country",employee.country],["Hire date",employee.hire_date],["Bank",employee.bank_name||"—"],["Branch",employee.bank_branch||"—"],["Account",employee.bank_account_last4?`****${employee.bank_account_last4}`:"—"],["Source",employee.source]].map(([k,v])=><div key={k}><span>{k}</span>
        <strong>{v}</strong>
        </div>)}</div>
      </section>
      <section className="card salary-highlight">
        <div>
          <span>Current annual CTC</span>
          <strong>{employee.currency} {Number(employee.salary).toLocaleString()}</strong>
          <small>Monthly CTC: {employee.currency} {(Number(employee.salary)/12).toLocaleString(undefined,{maximumFractionDigits:2})}</small>
          </div>
          <div className="salary-slip-actions">
            <label>Slip month<input type="month" value={salaryMonth} onChange={e=>setSalaryMonth(e.target.value)}/>
            </label>
            <button className="button primary" onClick={generateSlip} disabled={generating}><FileText size={16}/>{generating?"Generating…":"Generate & Download Slip"}</button>
          </div>
          </section>
    </div>

    <section className="card history-card">
      <div className="card-heading">
        <div>
          <h3>Previous salary details</h3>
          <span>Every CTC change is recorded with its effective date.</span>
          </div>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Effective date</th>
                  <th>Previous CTC</th>
                  <th>New CTC</th>
                  <th>Change</th>
                  <th>Reason</th>
                  </tr>
                  </thead>
                  <tbody>{(employee.salary_history||[]).map(item=>{const change=Number(item.new_ctc)-Number(item.previous_ctc);return <tr key={item.id}>
                    <td>{item.effective_date}</td>
                    <td>{item.currency} {Number(item.previous_ctc).toLocaleString()}</td>
                    <td>
                    <strong>{item.currency} {Number(item.new_ctc).toLocaleString()}</strong>
                      </td>
                      <td className={change>=0?"change-positive":"change-negative"}>{change>=0?"+":""}{item.currency} {change.toLocaleString()}</td>
                      <td>{item.reason}</td>
                      </tr>})}</tbody>
                      </table>
                      </div>
                    </section>

    <section className="card history-card">
      <div className="card-heading">
        <div>
          <h3>Monthly salary history</h3>
          <span>Generated payroll records and downloadable salary slips.</span>
          </div>
          <button className="icon-text-button" onClick={load}><RefreshCw size={15}/> Refresh</button>
          </div>
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>CTC</th>
                  <th>Gross</th>
                  <th>Deductions</th>
                  <th>Net pay</th>
                  <th>Status</th><th/>
                  </tr>
                </thead>
                <tbody>{(employee.recent_salary_records||[]).map(record=><tr key={record.id}>
                  <td>{new Date(record.pay_month).toLocaleDateString(undefined,{month:"long",year:"numeric"})}</td>
                  <td>{record.currency} {Number(record.ctc).toLocaleString()}</td>
                  <td>{record.currency} {Number(record.gross_pay).toLocaleString()}</td>
                  <td>{record.currency} {Number(record.total_deductions).toLocaleString()}</td>
                  <td>
                    <strong>{record.currency} {Number(record.net_pay).toLocaleString()}</strong>
                  </td>
                  <td>
                    <span className={`status ${record.payment_status === "paid" ? "active" : record.payment_status === "processing" ? "on_leave" : "inactive"}`}>{record.payment_status}</span>
                    </td>
                    <td>
                      <button className="icon-text-button" onClick={()=>downloadExisting(record)}><Download size={14}/> Slip</button>
                      </td>
                      </tr>)}</tbody>
                      </table>
                      </div>
                    </section>
  </div>;
}
