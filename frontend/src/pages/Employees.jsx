import "./Employees.css";
import { useEffect, useState } from "react";
import { Download, Eye, Pencil, Plus, Search, Trash2, Upload } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import ExcelImportModal from "../components/ExcelImportModal";
import EmptyState from "../components/EmptyState";

const statusLabel = { active: "Active", on_leave: "On Leave", inactive: "Inactive" };
const departments = ["Engineering", "Sales", "HR", "Finance", "Marketing", "Operations", "Product", "Legal", "IT", "Customer Success", "Data", "Administration"];
const countries = ["India", "USA", "UK", "Germany", "Canada", "Australia", "Japan", "France"];
const PAGE_SIZE = 20;

function getPageItems(page, totalPages) {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);

  const items = [1];
  const start = Math.max(2, page - 2);
  const end = Math.min(totalPages - 1, page + 2);

  if (start > 2) items.push("ellipsis-left");
  for (let n = start; n <= end; n += 1) items.push(n);
  if (end < totalPages - 1) items.push("ellipsis-right");
  items.push(totalPages);
  return items;
}

export default function Employees() {
  const location = useLocation();
  const navigate = useNavigate();
  const initialSearch = new URLSearchParams(location.search).get("search") || "";
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: initialSearch, department: "", country: "", status: "" });
  const [page, setPage] = useState(1);
  const [importOpen, setImportOpen] = useState(false);

  useEffect(() => {
    const urlSearch = new URLSearchParams(location.search).get("search") || "";
    setFilters((current) => current.search === urlSearch ? current : { ...current, search: urlSearch });
  }, [location.search]);

  const load = () => {
    setLoading(true);
    const params = { page, page_size: PAGE_SIZE, ...filters };
    Object.keys(params).forEach((key) => {
      if (params[key] === "") delete params[key];
    });

    api.get("/employees/", { params })
      .then((response) => setData(response.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [page, filters.search, filters.department, filters.country, filters.status]);

  const setFilter = (key, value) => {
    setPage(1);
    setFilters((previous) => ({ ...previous, [key]: value }));
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this employee? This cannot be undone.")) return;
    await api.delete(`/employees/${id}/`);
    load();
  };

  const exportCsv = async () => {
    const response = await api.get("/employees/export/", { params: filters, responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = "acme-employees.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const totalPages = Math.max(1, Math.ceil(data.count / PAGE_SIZE));
  const pageItems = getPageItems(page, totalPages);

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <p className="eyebrow">People & compensation</p>
          <h1>Employees</h1>
          <span>Manage salary records across the organization.</span>
        </div>
        <div className="heading-actions">
          <button className="button secondary" onClick={() => setImportOpen(true)}><Upload size={16} /> Import Excel</button>
          <button className="button secondary" onClick={exportCsv}><Download size={16} /> Export</button>
          <Link className="button primary" to="/employees/new"><Plus size={17} /> Add employee</Link>
        </div>
      </div>

      <div className="filter-bar">
        <div className="search-input">
          <Search size={17} />
          <input
            value={filters.search}
            onChange={(event) => setFilter("search", event.target.value)}
            placeholder="Search name, phone, ID, email, department…"
          />
        </div>
        <select value={filters.department} onChange={(event) => setFilter("department", event.target.value)}>
          <option value="">All departments</option>
          {departments.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.country} onChange={(event) => setFilter("country", event.target.value)}>
          <option value="">All countries</option>
          {countries.map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={filters.status} onChange={(event) => setFilter("status", event.target.value)}>
          <option value="">All status</option>
          <option value="active">Active</option>
          <option value="on_leave">On Leave</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <section className="card employee-table-card">
        <div className="table-toolbar">
          <div><strong>{data.count.toLocaleString()}</strong> employees</div>
          <span>Page {page} of {totalPages}</span>
        </div>

        {loading ? <div className="loading-panel">Loading employees…</div> : data.results.length === 0 ? <EmptyState /> : (
          <div className="table-scroll">
            <table className="data-table">
              <thead>
                <tr><th>Employee</th><th>Role</th><th>Department</th><th>Country</th><th>Salary</th><th>Status</th><th /></tr>
              </thead>
              <tbody>
                {data.results.map((emp) => (
                  <tr key={emp.id}>
                    <td>
                      <div className="employee-cell">
                        <div className="mini-avatar">{emp.first_name[0]}{emp.last_name[0]}</div>
                        <div><strong>{emp.full_name}</strong><span>{emp.employee_id} · {emp.email}</span></div>
                      </div>
                    </td>
                    <td>{emp.job_title}</td>
                    <td>{emp.department}</td>
                    <td>{emp.country}</td>
                    <td><strong>{emp.currency} {Number(emp.salary).toLocaleString()}</strong></td>
                    <td><span className={`status ${emp.status}`}>{statusLabel[emp.status]}</span></td>
                    <td>
                      <div className="row-actions">
                        <button title="View" onClick={() => navigate(`/employees/${emp.id}`)}><Eye size={16} /></button>
                        <button title="Edit" onClick={() => navigate(`/employees/${emp.id}/edit`)}><Pencil size={16} /></button>
                        <button title="Delete" onClick={() => remove(emp.id)}><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="pagination">
          <button disabled={page === 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>← Prev</button>
          {pageItems.map((item) => item.toString().startsWith("ellipsis") ? (
            <span className="pagination-ellipsis" key={item}>…</span>
          ) : (
            <button key={item} className={page === item ? "current" : ""} onClick={() => setPage(item)}>{item}</button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>Next →</button>
        </div>
      </section>

      {importOpen && <ExcelImportModal onClose={() => setImportOpen(false)} onImported={load} />}
    </div>
  );
}
