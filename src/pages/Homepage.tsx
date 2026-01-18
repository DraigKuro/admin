import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { tableApi } from "../api/tableApi";
import { orderApi } from "../api/orderApi";
import type { Table } from "../types/Table";
import type { Order, OrderStatus } from "../types/Order";
import "../styles/homepage.css";

export default function Homepage() {
  const [mesas, setMesas] = useState<Table[]>([]);
  const [pedidos, setPedidos] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargarDatos = async () => {
    try {
      const [mesasData, ordersRes] = await Promise.all([
        tableApi.getAll(),
        orderApi.getActiveOrders()
      ]);

      setMesas(mesasData);

      setPedidos(ordersRes.orders || []);

      setError(null);
    } catch (err) {
      console.error("Error cargando datos:", err);
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
    const interval = setInterval(cargarDatos, 30000);
    return () => clearInterval(interval);
  }, []);

  const avanzarEstado = async (orderId: string, currentStatus: OrderStatus) => {
    const nextStatusMap: Record<OrderStatus, OrderStatus> = {
      "pending": "confirmed",
      "confirmed": "preparing",
      "preparing": "ready",
      "ready": "served",
      "served": "served"
    };

    const nuevoEstado = nextStatusMap[currentStatus];

    try {
      await orderApi.updateStatus(orderId, nuevoEstado);
      cargarDatos();
    } catch (err) {
      alert("No se pudo actualizar el estado: " + err);
    }
  };

  const atenderMesa = async (id: string, requiereAtencion: boolean) => {
    if (!requiereAtencion) return;

    try {
      await tableApi.clearAlerts(id);
      cargarDatos();
    } catch (err) {
      console.error("No se pudo atender la mesa:", err);
    }
  };

  const obtenerNombreMesa = (tableId: string): string => {
    const mesaEncontrada = mesas.find(
      (m) => m._id === tableId || m.uid === tableId
    );
    return mesaEncontrada ? mesaEncontrada.nombre : `ID: ${tableId}`;
  };

  return (
    <Layout>
      <main className="homepage-container">
        <h1>Panel de Administración</h1>
        <section className="mesas-section">
          <div className="mesas-header">
            <h2>Estado de mesas</h2>
            {loading && <span className="loading-text">Cargando...</span>}
          </div>

          <div className="mesas-grid">
            {mesas.map((mesa) => {
              const tieneAlerta = mesa.peticionCamarero || mesa.peticionCuenta;

              return (
                <div
                  key={mesa._id}
                  onClick={() => atenderMesa(mesa._id, tieneAlerta)}
                  className={`mesa-card 
                    ${!mesa.activo ? "inactiva" : ""} 
                    ${mesa.peticionCamarero ? "alerta-camarero" : ""} 
                    ${mesa.peticionCuenta ? "alerta-cuenta" : ""}
                    ${tieneAlerta ? "cursor-pointer" : ""}`}
                >
                  <div className="mesa-content">
                    <span className="mesa-nombre">Mesa {mesa.nombre}</span>
                    
                    <div className="alerta-icons">
                      {mesa.peticionCamarero && <span className="icon-bell">🔔</span>}
                      {mesa.peticionCuenta && <span className="icon-bill">💰</span>}
                    </div>
                  </div>

                  <div className={`mesa-indicador ${mesa.estado ? "ocupada" : "libre"}`} />
                  
                  {tieneAlerta && (
                    <div className="atender-hint">Clic para atender</div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <div className="pedidos-section">
          <h2>Pedidos Activos en Cocina/Barra</h2>
          <div className="pedidos-grid">
            {pedidos.length === 0 && !loading && <p>No hay pedidos pendientes</p>}

            {pedidos.map((pedido) => (
              <div key={pedido._id} className="pedido-card">
                <div className="pedido-info">
                  <p className="pedido-mesa">Mesa: {obtenerNombreMesa(pedido.tableId)}</p>
                  <div className="pedido-items">
                    {pedido.items.map((item, index) => (
                      <p key={index} className="pedido-item-line">
                        {item.quantity}x {item.name}
                      </p>
                    ))}
                  </div>
                  <p className="pedido-total">Total: {pedido.total.toFixed(2)}€</p>
                </div>

                <span
                  className={`pedido-estado ${pedido.status}`}
                  onClick={() => avanzarEstado(pedido._id, pedido.status)}
                >
                  {pedido.status === "pending" && "Confirmar"}
                  {pedido.status === "confirmed" && "A Cocina"}
                  {pedido.status === "preparing" && "Preparando"}
                  {pedido.status === "ready" && "Listo"}
                  {pedido.status === "served" && "Servido"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}