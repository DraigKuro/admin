type SidebarProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

import { Link } from "react-router-dom";

export default function Sidebar({ open, setOpen }: SidebarProps) {
  return (
    <aside className={open ? "sidebar" : "sidebar sidebar-collapsed"}>
      <div className="sidebar-title-row">
        {open && (
          <Link to="/" className="sidebar-title sidebar-title-link">
            Saborify 🍽️
          </Link>
        )}
        <button
          className="sidebar-btn"
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sidebar-btn-icon">
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>
      {open && (
        <nav>
          <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/restaurant-info">Datos del restaurante</Link></li>
            <li><Link to="/dishes">Platos</Link></li>
            <li><Link to="/drinks">Bebidas</Link></li>
            <li><Link to="/menus">Menú</Link></li>
            <li><Link to="/promotions">Promociones</Link></li>
            <li><Link to="/tables">Mesas</Link></li>
          </ul>
        </nav>
      )}
    </aside>
  );
}
