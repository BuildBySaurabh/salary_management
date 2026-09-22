import "./Dashboard.css";
import { useEffect, useMemo, useState } from "react";
import { Building2, Globe2, Users, WalletCards } from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import world from "world-atlas/countries-110m.json";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import StatCard from "../components/StatCard";
import ChartCard from "../components/ChartCard";

const chartColors = ["#2f7df4", "#1db798", "#7a5af8", "#ff9b21", "#f23f6b", "#34b8cf", "#8d8be9", "#cbd5e1", "#4d75d6", "#16a34a", "#e879f9", "#64748b"];
const currencySymbol = { USD: "$", INR: "₹", GBP: "£", EUR: "€", CAD: "C$", AUD: "A$", JPY: "¥" };
const countryAliases = {
  India: ["India"],
  USA: ["United States of America", "United States"],
  UK: ["United Kingdom"],
  Germany: ["Germany"],
  Canada: ["Canada"],
  Australia: ["Australia"],
  Japan: ["Japan"],
  France: ["France"],
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [hoveredCountry, setHoveredCountry] = useState(null);

  useEffect(() => {
    api.get("/dashboard/")
      .then((response) => setData(response.data))
      .catch(() => setError("Could not load dashboard data."));
  }, []);

  const countryData = useMemo(() => data?.by_country?.map((item) => ({ name: item.country, value: item.value })) || [], [data]);
  const deptData = useMemo(() => data?.by_department?.map((item) => ({ name: item.department, value: item.value })) || [], [data]);
  const countryCounts = useMemo(() => Object.fromEntries(countryData.map((item) => [item.name, item.value])), [countryData]);

  if (error) return <div className="page-error">{error}</div>;
  if (!data) return <div className="loading-panel">Loading dashboard…</div>;

  const k = data.kpis;
  const firstName = (user?.name || "Sarah").split(" ")[0];
  const maxCountryCount = Math.max(...countryData.map((item) => item.value), 1);

  const countryInfo = (mapName) => {
    const match = Object.entries(countryAliases).find(([, names]) => names.includes(mapName));
    if (!match) return null;
    const count = countryCounts[match[0]] || 0;
    return { name: match[0], count, percent: (count / k.total_employees) * 100 };
  };

  return <div className="dashboard-page">
    <section className="hero-banner">
      <div>
        <h1>Good morning, {firstName}! ☀️</h1>
        <p>Here's what's happening with your team today.</p>
        <span>Manage salaries, explore insights, and keep your organization running smoothly.</span>
        </div>
        <div className="hero-illustration">
          <div className="hero-screen">
            <div/>
            <div/>
            <div/>
            </div>
            <i/><i/>
            </div>
            </section>

    <div className="stats-grid">
      <StatCard tone="blue" icon={<Users/>} label="Total Employees" value={k.total_employees.toLocaleString()} change="↑ 5% from last month"/>
      <StatCard tone="green" icon={<Globe2/>} label="Countries" value={k.countries} change="↑ 1 new country"/>
      <StatCard tone="purple" icon={<Building2/>} label="Departments" value={k.departments} change="↑ 2 new departments"/>
      <StatCard tone="orange" icon={<WalletCards/>} label="Currencies" value={k.currencies} change="↑ 0 change"/>
    </div>

    <div className="dashboard-grid">
      <ChartCard title="Employees by Country" action={<span className="small-pill">Top 12</span>} className="country-card">
        <ResponsiveContainer width="100%" height={245}>
          <BarChart data={countryData} margin={{ top: 10, right: 10, left: -20, bottom: 10 }}>
            <CartesianGrid vertical={false} stroke="#e8edf5"/>
            <XAxis dataKey="name" tick={{fontSize:12}}/>
            <YAxis tick={{fontSize:11}}/>
            <Tooltip formatter={(value) => Number(value).toLocaleString()}/>
              <Bar dataKey="value" radius={[7,7,0,0]}>{countryData.map((_,i)=><Cell key={i} fill={chartColors[i%chartColors.length]}/>)}</Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
      <ChartCard title="Employees by Department">
        <div className="donut-wrap">
          <ResponsiveContainer width="55%" height={245}>
            <PieChart>
              <Pie data={deptData} dataKey="value" nameKey="name" innerRadius={65} outerRadius={95} paddingAngle={1}>{deptData.map((_,i)=><Cell key={i} fill={chartColors[i%chartColors.length]}/>)}</Pie>
              <Tooltip/>
              </PieChart>
              </ResponsiveContainer>
              <div className="legend-list">{deptData.slice(0,8).map((x,i)=><div key={x.name}>
                <span className="legend-dot" style={{background:chartColors[i]}}/>
                <span>{x.name}</span>
                <b>{Math.round(x.value/k.total_employees*100)}%</b>
                </div>)}
                </div>
                </div>
      </ChartCard>
    </div>

    <div className="dashboard-grid lower">
      <ChartCard title="Salary Overview by Currency">
        <div className="table-wrap">
          <table className="data-table compact">
            <thead><tr>
                        <th>Currency</th>
                        <th>Employees</th>
                        <th>Average Salary</th>
                        <th>Total Payroll</th>
                        </tr>
                        </thead>
                        <tbody>{data.by_currency.map(x=><tr key={x.currency}><td>
                          <strong>{x.currency}</strong>
                          </td>
                          <td>{x.employees.toLocaleString()}</td>
                          <td>{currencySymbol[x.currency]||""}{Math.round(x.average_salary).toLocaleString()}</td>
                          <td>{currencySymbol[x.currency]||""}{Math.round(x.total_payroll).toLocaleString()}</td>
                          </tr>)}</tbody>
                          </table>
                          </div>
                          </ChartCard>

      <ChartCard title="Global Distribution">
        <div className="distribution-panel world-distribution">
          <div className="world-map-wrap">
            <ComposableMap projectionConfig={{ scale: 145 }} width={500} height={250}>
              <Geographies geography={world}>
                {({ geographies }) => geographies.map((geo) => {
                  const name = geo.properties.name;
                  const info = countryInfo(name);
                  const ratio = info ? info.count / maxCountryCount : 0;
                  const fill = info && info.count > 0 ? `rgba(47,125,244,${0.25 + ratio * 0.65})` : "#edf1f6";
                  return <Geography key={geo.rsmKey} geography={geo} onMouseEnter={() => info && setHoveredCountry(info)} onMouseLeave={() => setHoveredCountry(null)} style={{ default:{fill,outline:"none",stroke:"#ffffff",strokeWidth:0.45}, hover:{fill: info ? "#1f67d2" : "#edf1f6",outline:"none",cursor: info ? "pointer" : "default"}, pressed:{fill:"#1857b4",outline:"none"} }} />;
                })}
              </Geographies>
            </ComposableMap>
            {hoveredCountry && <div className="map-tooltip">
              <strong>{hoveredCountry.name}</strong>
              <span>{hoveredCountry.count.toLocaleString()} employees</span>
              <small>{hoveredCountry.percent.toFixed(2)}% of organization</small>
              </div>}
          </div>
          <div className="country-list">{countryData.slice(0,8).map((x,i)=><div key={x.name}>
            <span className="legend-dot" style={{background:chartColors[i]}}/>{x.name}
            <b>{x.value.toLocaleString()}</b>
            </div>)}
            </div>
        </div>
      </ChartCard>
    </div>

    <footer className="app-footer">ACME Salary Manager <span>© 2026</span>
    <span className="system-status"><i/> System Online</span>
    </footer>
  </div>;
}
