import { useState, useEffect, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt, FaDownload } from "react-icons/fa";
import Layout from "../components/Layout";
import TableForm from "../components/forms/TableForm";
import type { Table } from "../types/Table";
import QRCode from "qrcode";
import { tableApi } from "../api/tableApi";
import "../styles/tables.css";
import "../styles/form.css";
import "../styles/modal.css";

export default function Tables() {
  const [tables, setTables] = useState<Table[]>([]);
  const [sortField, setSortField] = useState<keyof Table>("nombre");
  const [sortAsc, setSortAsc] = useState(true);
  const [showFormModal, setShowFormModal] = useState(false);
  const [editTable, setEditTable] = useState<Table | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; tableId?: string }>({ open: false });

  useEffect(() => {
    async function fetchTables() {
      try {
        const allTables = await tableApi.getAll();
        setTables(allTables);
      } catch (err) {
        console.error("Error al cargar mesas:", err);
      }
    }
    fetchTables();
  }, []);

  const sortedTables = useMemo(() => {
    return [...tables].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "boolean" && typeof valB === "boolean") return 0;
      return String(valA).toLowerCase().localeCompare(String(valB).toLowerCase()) * (sortAsc ? 1 : -1);
    });
  }, [tables, sortField, sortAsc]);

  const toggleSort = (field: keyof Table) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSaveTable = async (tableData: Partial<Table>) => {
    if (!tableData.nombre) return;
    try {
      let saved: Table;
      const payload = {
        nombre: tableData.nombre,
        estado: tableData.estado ?? false,
        activo: tableData.activo ?? true,
      };

      if (editTable?._id) {
        saved = await tableApi.update(editTable._id, payload);
        setTables(tables.map(t => t._id === editTable._id ? saved : t));
      } else {
        saved = await tableApi.create(payload);
        setTables([...tables, saved]);
      }

      setShowFormModal(false);
      setEditTable(null);
    } catch (err) {
      console.error("Error al guardar mesa:", err);
    }
  };

  const toggleActivo = async (table: Table) => {
    try {
      const updated = await tableApi.update(table._id!, { activo: !table.activo });
      setTables(tables.map(t => t._id === table._id ? updated : t));
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.tableId) return;
    try {
      await tableApi.remove(deleteModal.tableId);
      setTables(tables.filter(t => t._id !== deleteModal.tableId));
      setDeleteModal({ open: false });
    } catch (err) {
      console.error(err);
    }
  };

  const downloadQR = async (table: Table) => {
  try {
    const size = 512;
    const pngUrl = await QRCode.toDataURL(table.qrUrl, { width: size, margin: 2 });

    const link = document.createElement("a");
    link.href = pngUrl;
    link.download = `mesa-${table.nombre}.png`;
    link.click();
  } catch (err) {
    console.error("Error al generar QR:", err);
  }
};

  return (
    <Layout>
      <div className="page-content">
        <div className="app-header-row">
          <h1>Mesas</h1>
          <button className="app-create-btn" onClick={() => { setShowFormModal(true); setEditTable(null); }}>Crear mesa</button>
        </div>

        <div className="app-table-container">
          {tables.length === 0 ? (
            <div className="app-empty">No hay mesas registradas aún.</div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <SortableHeader label="Nombre" field="nombre" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} />
                  <th>Estado</th>
                  <th>QR</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedTables.map(table => (
                  <tr key={table._id}>
                    <td>{table.nombre}</td>
                    <td>
                      <label className="switch">
                        <input type="checkbox" checked={table.activo} onChange={() => toggleActivo(table)} />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>
                      <button className="app-action-btn download" title="Descargar QR" onClick={() => downloadQR(table)}><FaDownload /></button>
                    </td>
                    <td>
                      <button className="app-action-btn edit" title="Editar" onClick={() => { setEditTable(table); setShowFormModal(true); }}><FaRegEdit /></button>
                      <button className="app-action-btn delete" title="Eliminar" onClick={() => setDeleteModal({ open: true, tableId: table._id })}><FaRegTrashAlt /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showFormModal && (
          <div className="app-form-fullscreen">
            <div className="app-form-content">
              <button className="app-modal-close" onClick={() => { setShowFormModal(false); setEditTable(null); }}>×</button>
              <h2 className="app-modal-title">{editTable ? "Editar mesa" : "Crear mesa"}</h2>
              <TableForm table={editTable} onSave={handleSaveTable} onCancel={() => { setShowFormModal(false); setEditTable(null); }} />
            </div>
          </div>
        )}

        {deleteModal.open && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <p>¿Estás seguro de que quieres eliminar esta mesa?</p>
              <div className="modal-actions">
                <button className="modal-btn confirm" onClick={handleDelete}>Eliminar</button>
                <button className="modal-btn cancel" onClick={() => setDeleteModal({ open: false })}>Cancelar</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
}

function SortableHeader({ label, field, sortField, sortAsc, onSort, align = "left" }: {
  label: string;
  field: keyof Table;
  sortField: keyof Table;
  sortAsc: boolean;
  onSort: (field: keyof Table) => void;
  align?: "left" | "right";
}) {
  return (
    <th className={`${sortField === field ? "sort-active" : ""} ${align}`} onClick={() => onSort(field)}>
      {label} <span className="sort-arrow">{sortField === field ? (sortAsc ? "▲" : "▼") : "▲"}</span>
    </th>
  );
}