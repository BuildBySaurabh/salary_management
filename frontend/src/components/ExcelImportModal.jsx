import "./ExcelImportModal.css";
import {useRef,useState} from "react";
import * as XLSX from "xlsx";
import Modal from "./Modal";
import api from "../services/api";

const expected=["employee_id","first_name","last_name","email","job_title","department","country","currency","salary","hire_date"];

export default function ExcelImportModal({onClose,onImported}){
 const inputRef=useRef(null);const[file,setFile]=useState(null);const[preview,setPreview]=useState([]);const[error,setError]=useState("");const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);
 const choose=async selected=>{const picked=selected?.[0];if(!picked)return;setError("");if(!/\.(xlsx|xls)$/i.test(picked.name)){setError("Please choose an Excel .xlsx or .xls file.");return;}setFile(picked);const buffer=await picked.arrayBuffer();const workbook=XLSX.read(buffer,{type:"array",cellDates:true});const rows=XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]],{header:1,defval:""});setPreview(rows.slice(0,6));};
 const upload=async()=>{if(!file)return;setLoading(true);setError("");const data=new FormData();data.append("file",file);try{const{data:response}=await api.post("/employees/import/",data,{headers:{"Content-Type":"multipart/form-data"}});setResult(response);onImported();}catch(err){setError(err.response?.data?.detail||"Import failed.");}finally{setLoading(false);}};
 return <Modal title="Import employees from Excel" onClose={onClose} wide><div className="upload-zone" onClick={()=>inputRef.current?.click()}><input ref={inputRef} hidden type="file" accept=".xlsx,.xls" onChange={e=>choose(e.target.files)}/><strong>{file?file.name:"Drop an Excel file here or click to browse"}</strong><span>Recommended columns: {expected.join(", ")}</span></div>{error&&<div className="form-error">{error}</div>}{preview.length>0&&<div className="preview-table"><table><tbody>{preview.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j}>{String(cell)}</td>)}</tr>)}</tbody></table></div>}{result&&<div className="success-box">Imported successfully: {result.created} created, {result.updated} updated, {result.error_count} errors.</div>}<div className="form-actions"><button className="button secondary" onClick={onClose}>Close</button><button className="button primary" disabled={!file||loading} onClick={upload}>{loading?"Importing…":"Import file"}</button></div></Modal>;
}
