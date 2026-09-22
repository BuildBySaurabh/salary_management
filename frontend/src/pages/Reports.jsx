import "./Reports.css";
import {useEffect,useState} from "react";
import {Bar,BarChart,CartesianGrid,ResponsiveContainer,Tooltip,XAxis,YAxis} from "recharts";
import api from "../services/api";
import ChartCard from "../components/ChartCard";

export default function Reports(){
 const[data,setData]=useState(null);
 useEffect(()=>{api.get("/reports/").then(r=>setData(r.data));},[]);
 if(!data)return <div className="loading-panel">Loading reports…</div>;
 return <div className="page">
<div className="page-heading">
        <div>
            <p className="eyebrow">Insights</p>
            <h1>Reports</h1>
            <span>Understand headcount and compensation distribution.</span>
        </div>
    </div>
 <div className="report-grid">
    <ChartCard title="Payroll by Department">
        <ResponsiveContainer width="100%" height={330}>
            <BarChart data={data.department.slice(0,12)} layout="vertical" margin={{left:30,right:25}}>
                <CartesianGrid horizontal={false} stroke="#e8edf5"/>
                <XAxis type="number"/>
                <YAxis type="category" dataKey="department" width={115}/>
                <Tooltip formatter={v=>Number(v).toLocaleString()}/>
                    <Bar dataKey="payroll" fill="#2f7df4" radius={[0,5,5,0]}/>
            </BarChart>
        </ResponsiveContainer>
        </ChartCard>
 <ChartCard title="Average salary by country">
    <ResponsiveContainer width="100%" height={330}>
        <BarChart data={data.country}><CartesianGrid vertical={false} stroke="#e8edf5"/>
        <XAxis dataKey="country" tick={{fontSize:11}}/>
        <YAxis/><Tooltip formatter={v=>Number(v).toLocaleString()}/>
            <Bar dataKey="avg_salary" fill="#1db798" radius={[6,6,0,0]}/>
        </BarChart>
    </ResponsiveContainer>
</ChartCard>
</div>
 <section className="card">
    <div className="card-heading">
        <h3>Department detail</h3>
    </div>
    <div className="table-scroll">
        <table className="data-table">
            <thead>
                <tr>
                    <th>Department</th>
                    <th>Employees</th>
                    <th>Average salary</th>
                    <th>Total payroll</th>
                    </tr>
                    </thead>
                    <tbody>{data.department.map(x=><tr key={x.department}>
                        <td>
                            <strong>{x.department}</strong>
                            </td>
                            <td>{x.employees.toLocaleString()}</td>
                            <td>{Math.round(x.avg_salary).toLocaleString()}</td>
                            <td>{Math.round(x.payroll).toLocaleString()}</td>
                            </tr>)}</tbody>
                    </table>
                </div>
                    </section>
        </div>;
}
