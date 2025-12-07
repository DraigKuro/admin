import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, logout } from "../api/authApi";
import { Link } from "react-router-dom";
import "../styles/login.css";

export default function Login() {
  const [usuario, setUsuario] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.login(usuario, contraseña);

      navigate("/", { replace: true });

    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión");
      logout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Iniciar sesión</h2>

        {error && <p className="error-message">{error}</p>}

        <label htmlFor="user">Usuario</label>
        <input
          id="user"
          type="text"
          placeholder="Usuario"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
          required
        />

        <label htmlFor="pass">Contraseña</label>
        <input
          id="pass"
          type="password"
          placeholder="Contraseña"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          ¿Primera vez? <Link to="/register">Crear cuenta de administrador</Link>
        </p>
      </form>
    </div>
  );
}
