import "./StatCard.css";
export default function StatCard({icon,label,value,change,tone="blue"}){
 return <div className={`stat-card ${tone}`}><div className="stat-icon">{icon}</div><div><span>{label}</span><strong>{value}</strong><small>{change}</small></div></div>;
}
