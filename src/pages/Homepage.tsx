import { useState } from "react";
import Layout from "../components/Layout";
import type { Table } from "../types/Table";
import "../styles/homepage.css";

type Pedido = {
  id: string;
  mesa: string;
  descripcion: string;
  estado: "preparando" | "listo" | "servido";
};

export default function Homepage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([
    { id: "1", mesa: "Mesa 1", descripcion: "Pizza + Coca", estado: "preparando" },
    { id: "2", mesa: "Mesa 2", descripcion: "Hamburguesa", estado: "listo" },
    { id: "3", mesa: "Mesa 3", descripcion: "Ensalada", estado: "servido" },
  ]);

  const [mesas] = useState<Table[]>([
    { _id: "1", nombre: "Mesa 1", uid: "uid1", estado: true, activo: true, qrUrl: "" },
    { _id: "2", nombre: "Mesa 2", uid: "uid2", estado: false, activo: true, qrUrl: "" },
    { _id: "3", nombre: "Mesa 3", uid: "uid3", estado: true, activo: true, qrUrl: "" },
  ]);

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
            {pedidos.map((pedido) => (
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
          <h2>Mesas</h2>
          <div className="mesas-grid">
            {mesas.map(mesa => (
              <div key={mesa._id} className="mesa-card">
                <span>{mesa.nombre}</span>
                <div
                  className={`mesa-indicador ${mesa.estado ? "ocupada" : "libre"}`}
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
}
