import "../styles/login.css";

export default function Login() {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Iniciar sesión</h2>
        <label htmlFor="user">Usuario</label>
        <input id="user" type="text" placeholder="Usuario" />
        <label htmlFor="pass">Contraseña</label>
        <input id="pass" type="password" placeholder="Contraseña" />
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}
