import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/authApi";
import "../styles/login.css";

export default function Register() {
    const [usuario, setUsuario] = useState("");
    const [contraseña, setContraseña] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.register(usuario, contraseña);
            setSuccess(true);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err: any) {
            setError(err.message || "Error al crear la cuenta");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Crear cuenta de administrador</h2>

                {success && <p className="success-message">¡Cuenta creada! Redirigiendo al login...</p>}
                {error && <p className="error-message">{error}</p>}

                <label htmlFor="user">Usuario</label>
                <input
                    id="user"
                    type="text"
                    placeholder="Usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    required
                    disabled={loading}
                />

                <label htmlFor="pass">Contraseña</label>
                <input
                    id="pass"
                    type="password"
                    placeholder="Contraseña"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                    required
                    disabled={loading}
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Creando..." : "Crear cuenta"}
                </button>

                <p style={{ textAlign: "center", marginTop: "20px" }}>
                    ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
                </p>
            </form>
        </div>
    );
}