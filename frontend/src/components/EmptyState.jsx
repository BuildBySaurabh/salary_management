import "./EmptyState.css";
export default function EmptyState({title="No data found",message="Try changing your filters."}){return <div className="empty-state"><strong>{title}</strong><span>{message}</span></div>;}
