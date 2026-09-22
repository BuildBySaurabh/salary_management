import "./Modal.css";
export default function Modal({title,onClose,children,wide=false}){
 return <div className="modal-backdrop" onMouseDown={onClose}><div className={`modal ${wide?"modal-wide":""}`} onMouseDown={e=>e.stopPropagation()}><div className="modal-header"><h2>{title}</h2><button onClick={onClose} className="modal-close">×</button></div>{children}</div></div>;
}
