import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <header className="main-header">
      <h2>Panel de Administración</h2>
      <button className="logout-btn" onClick={() => navigate("/login")}>Cerrar sesión</button>
    </header>
  );
}
