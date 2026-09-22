import "./SalarySheets.css";
import { useEffect, useState } from "react";
import { CalendarDays, Download, FileSpreadsheet, Play, Search, Upload } from "lucide-react";
import api from "../services/api";

const statusLabel = { paid: "Paid", unpaid: "Unpaid", processing: "Processing" };
const PAGE_SIZE = 25;

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a"); link.href = url; link.download = filename; link.click(); URL.revokeObjectURL(url);
}

export default function SalarySheets() {
  const now = new Date();
  const defaultMonth = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}`;
  const [month, setMonth] = useState(defaultMonth);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [error, setError] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [employeeOptions, setEmployeeOptions] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const load = () => {
    setLoading(true); setError("");
    api.get("/salary-records/", { params: { page, page_size: PAGE_SIZE, month, payment_status: status || undefined, search: search || undefined } })
      .then(r => setData(r.data)).catch(() => setError("Could not load the salary sheet."))
      .finally(() => setLoading(false));
  };
  useEffect(() => { setPage(1); }, [month, status, search]);
  useEffect(() => { const timer = setTimeout(load, 200); return () => clearTimeout(timer); }, [month, status, search, page]);
  useEffect(() => {
    if (!employeeSearch.trim()) { setEmployeeOptions([]); return; }
    const timer = setTimeout(() => api.get("/employees/", { params: { search: employeeSearch.trim(), page: 1, page_size: 8 } }).then(r => setEmployeeOptions(r.data.results || [])).catch(() => setEmployeeOptions([])), 250);
    return () => clearTimeout(timer);
  }, [employeeSearch]);

  const generate = async () => {
    setGenerating(true); setMessage(""); setError("");
    try { const { data: result } = await api.post("/salary-records/generate/", { month, employee_ids: selectedEmployees.map(x => x.id) }); setMessage(`${result.count.toLocaleString()} monthly salary records are ready for ${month}.`); load(); }
    catch (err) { setError(err.response?.data?.detail || "Could not generate the salary sheet."); }
    finally { setGenerating(false); }
  };

  const importExcel = async event => {
    const file = event.target.files?.[0]; if (!file) return;
    setError(""); setMessage(""); const form = new FormData(); form.append("file", file);
    try { const { data: result } = await api.post("/salary-records/import/", form, { headers: { "Content-Type": "multipart/form-data" } }); setMessage(`Imported ${result.created + result.updated} salary rows. ${result.error_count} errors.`); load(); }
    catch (err) { setError(err.response?.data?.detail || "Salary sheet import failed."); }
    event.target.value = "";
  };

  const updateStatus = async (id, value) => {
    try { await api.patch(`/salary-records/${id}/`, { payment_status: value }); load(); }
    catch { setError("Could not update payment status."); }
  };

  const exportExcel = async () => {
    const response = await api.get("/salary-records/export/", { params: { month, payment_status: status || undefined, search: search || undefined }, responseType: "blob" });
    downloadBlob(response.data, `acme-salary-sheet-${month}.xlsx`);
  };

  return <div className="page salary-sheet-page">
    <div className="page-heading"><div><p className="eyebrow">Payroll operations</p><h1>Salary Sheets</h1><span>Create, review and export the monthly payroll sheet.</span></div><div className="heading-actions"><label className="button secondary file-button"><Upload size={16}/> Import Excel<input hidden type="file" accept=".xlsx,.xls" onChange={importExcel}/></label><button className="button secondary" onClick={exportExcel}><Download size={16}/> Export Excel</button><button className="button primary" onClick={generate} disabled={generating}><Play size={15}/> {generating ? "Calculating…" : selectedEmployees.length ? `Generate ${selectedEmployees.length} selected` : "Generate month"}</button></div></div>

    <section className="card salary-controls">
      <div className="salary-control"><CalendarDays size={17}/>
      <label>Payroll month<input type="month" value={month} onChange={e=>setMonth(e.target.value)}/>
      </label>
      </div>
      <div className="salary-picker">
        <Search size={16}/>
      <input value={employeeSearch} onChange={e=>setEmployeeSearch(e.target.value)} placeholder="Add employee by name or ID…"/>{employeeOptions.length>0&&
      <div className="employee-options">{employeeOptions.map(emp=><button key={emp.id} type="button" onClick={()=>{if(!selectedEmployees.some(x=>x.id===emp.id))setSelectedEmployees([...selectedEmployees,emp]);setEmployeeSearch("");setEmployeeOptions([])}}>
        <strong>{emp.full_name}</strong>
        <span>{emp.employee_id} · {emp.department}</span>
        </button>)}</div>}</div>
        <div className="selected-employees">{selectedEmployees.map(emp=><button key={emp.id} type="button" onClick={()=>setSelectedEmployees(selectedEmployees.filter(x=>x.id!==emp.id))}>{emp.employee_id} ×</button>)}</div>
        <div className="search-input">
          <Search size={17}/>
          <input value={search} onChange={e=>{setPage(1);setSearch(e.target.value)}} placeholder="Filter salary rows…"/>
          </div>
          <select value={status} onChange={e=>setStatus(e.target.value)}>
            <option value="">All payment status</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="processing">Processing</option>
            </select>
          </section>

    {message && <div className="success-box">{message}</div>}{error && <div className="form-error">{error}</div>}

    <section className="card employee-table-card">
      <div className="table-toolbar"><div>
        <strong>{data.count.toLocaleString()}</strong> salary rows</div>
        <span>Monthly CTC, earnings, deductions and net pay</span>
        </div>{loading ? <div className="loading-panel">Loading salary records…</div> : data.results.length === 0 ? <div className="empty-salary">
          <FileSpreadsheet size={30}/>
          <strong>No salary rows for this month</strong>
          <span>Click Generate month to create the sheet from employee CTC and HR payroll rules.</span>
          </div> : <div className="table-scroll">
            <table className="data-table salary-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>CTC</th>
                  <th>Department</th>
                  <th>Bank</th>
                  <th>Gross</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  </tr>
                </thead>
              <tbody>{data.results.map(row=><tr key={row.id}>
                <td><strong>{row.employee_name}</strong>
                <span className="table-subtext">{row.employee_code}</span>
                </td>
                <td>{row.currency} {Number(row.ctc).toLocaleString()}</td>
                <td>{row.department}</td>
                <td>{row.bank_name || "—"}<span className="table-subtext">{row.bank_branch || ""} {row.bank_account_last4 ? `· ****${row.bank_account_last4}` : ""}</span>
                </td>
                <td>{row.currency} {Number(row.gross_pay).toLocaleString()}</td>
                <td>{row.currency} {Number(row.total_deductions).toLocaleString()}</td>
                <td>
                  <strong>{row.currency} {Number(row.net_pay).toLocaleString()}</strong>
                  </td>
                  <td>
                    <select className={`status-select ${row.payment_status}`} value={row.payment_status} onChange={e=>updateStatus(row.id,e.target.value)}>
                      <option value="paid">Paid</option>
                      <option value="unpaid">Unpaid</option>
                      <option value="processing">Processing</option>
                      </select>
                      </td>
                      </tr>)}
                      </tbody>
                      </table>
                      </div>}
                      </section>
    {data.count > PAGE_SIZE && <div className="pagination salary-pagination">
      <button disabled={page===1} onClick={()=>setPage(p=>p-1)}>Previous</button>
      <span>Page {page} of {Math.max(1, Math.ceil(data.count/PAGE_SIZE))}</span>
      <button disabled={page>=Math.ceil(data.count/PAGE_SIZE)} onClick={()=>setPage(p=>p+1)}>Next</button>
      </div>}
    <div className="payroll-note">
      <strong>Calculation note:</strong> the assessment uses a standard configurable formula for basic pay, HRA, allowances and deductions. Country-specific statutory payroll rules should be configured before production payroll processing.</div>
  </div>;
}
