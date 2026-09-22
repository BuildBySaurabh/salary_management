import "./ChartCard.css";
export default function ChartCard({title,children,className="",action}){
 return <section className={`card chart-card ${className}`}><div className="card-heading"><h3>{title}</h3>{action}</div>{children}</section>;
}
