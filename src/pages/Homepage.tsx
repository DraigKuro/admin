import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { tableApi } from "../api/tableApi";
import type { Table } from "../types/Table";
import type { Order } from "../types/Order";
import "../styles/homepage.css";

export default function Homepage() {
  const [mesas, setMesas] = useState<Table[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [pedidos, setPedidos] = useState<Order[]>([
    { id: "1", mesa: "Mesa 1", descripcion: "Pizza + Coca", estado: "preparando" },
    { id: "2", mesa: "Mesa 2", descripcion: "Hamburguesa", estado: "listo" },
    { id: "3", mesa: "Mesa 3", descripcion: "Ensalada", estado: "servido" },
  ]);

  const cargarMesas = async () => {
    try {
      const data = await tableApi.getAll();
      setMesas(data);
      setError(null);
    } catch (err) {
      console.error("Error cargando mesas:", err);
      setError("Error al cargar mesas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMesas();

    const interval = setInterval(() => {
      cargarMesas();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const avanzarEstado = (id: string) => {
    setPedidos(prev =>
      prev.map(p =>
        p.id === id
          ? {
            ...p,
            estado:
              p.estado === "preparando"
                ? "listo"
                : p.estado === "listo"
                  ? "servido"
                  : "servido",
          }
          : p
      )
    );
  };

  return (
    <Layout>
      <main className="homepage-container">
        <h1>Bienvenido al panel de administración</h1>
        <p>Gestiona usuarios, productos y más desde aquí.</p>
        <div className="pedidos-section">
          <h2>Pedidos</h2>
          <div className="pedidos-grid">
            {pedidos
              .filter(p => p.estado !== "servido")
              .map((pedido) => (
                <div key={pedido.id} className="pedido-card">
                  <div className="pedido-info">
                    <p className="pedido-mesa">{pedido.mesa}</p>
                    <p className="pedido-descripcion">{pedido.descripcion}</p>
                  </div>
                  <span
                    className={`pedido-estado ${pedido.estado}`}
                    onClick={() => avanzarEstado(pedido.id)}
                  >
                    {pedido.estado === "preparando"
                      ? "Prep"
                      : pedido.estado === "listo"
                        ? "Listo"
                        : "Serv"}
                  </span>
                </div>
              ))}
          </div>
        </div>
        <section className="mesas-section">
          <div className="mesas-header">
            <h2>Estado de mesas</h2>
            {loading && <span className="loading-text">Actualizando...</span>}
          </div>

          {error && <p className="error-text">{error}</p>}

          <div className="mesas-grid">
            {mesas.length === 0 && !loading && (
              <p>No hay mesas registradas</p>
            )}

            {mesas.map((mesa) => (
              <div
                key={mesa._id}
                className={`mesa-card ${mesa.activo === false ? "inactiva" : ""}`}
              >
                <span className="mesa-nombre">Mesa {mesa.nombre}</span>
                <div
                  className={`mesa-indicador ${mesa.estado ? "ocupada" : "libre"}`}
                  title={mesa.estado ? "Ocupada por cliente" : "Libre"}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
