import { useState, useEffect, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import MenuForm from "../components/forms/MenuForm";
import type { Menu } from "../types/Menu";
import type { Dish } from "../types/Dish";
import type { Drink } from "../types/Drink";
import { menuApi } from "../api/menuApi";
import { dishApi } from "../api/dishApi";
import { drinkApi } from "../api/drinkApi";
import "../styles/tables.css";
import "../styles/form.css";
import "../styles/modal.css";

export default function Menus() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editMenu, setEditMenu] = useState<Menu | null>(null);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; menuId?: string }>({ open: false });

  const [sortField, setSortField] = useState<keyof Menu>("nombre");
  const [sortAsc, setSortAsc] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [allDishes, allDrinks, allMenus] = await Promise.all([
          dishApi.getAll(),
          drinkApi.getAll(),
          menuApi.getAll(),
        ]);
        setDishes(allDishes);
        setDrinks(allDrinks);
        setMenus(allMenus);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    }
    fetchData();
  }, []);

  const sortedMenus = useMemo(() => {
    return [...menus].sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      if (typeof valA === "number" && typeof valB === "number") {
        return sortAsc ? valA - valB : valB - valA;
      }
      return String(valA).toLowerCase().localeCompare(String(valB).toLowerCase()) * (sortAsc ? 1 : -1);
    });
  }, [menus, sortField, sortAsc]);

  const toggleSort = (field: keyof Menu) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const handleSaveMenu = async (menu: Menu, file?: File) => {
    try {
      let saved: Menu;
      if (editMenu?._id) {
        saved = await menuApi.update(editMenu._id, menu, file);
        setMenus(menus.map(m => m._id === editMenu._id ? saved : m));
      } else {
        saved = await menuApi.create(menu, file);
        setMenus([...menus, saved]);
      }
      setShowModal(false);
      setEditMenu(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    setShowModal(false);
    setEditMenu(null);
  };

  const toggleActivo = async (menu: Menu) => {
    try {
      const updated = await menuApi.update(menu._id!, { activo: !menu.activo });
      setMenus(menus.map(m => m._id === menu._id ? updated : m));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.menuId) return;
    try {
      await menuApi.remove(deleteModal.menuId);
      setMenus(menus.filter(m => m._id !== deleteModal.menuId));
      setDeleteModal({ open: false });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout>
      <div className="page-content">
        <div className="app-header-row">
          <h1>Menús</h1>
          <button
            className="app-create-btn"
            onClick={() => { setShowModal(true); setEditMenu(null); }}
          >
            Crear menú
          </button>
        </div>

        <div className="app-table-container">
          {menus.length === 0 ? (
            <div className="app-empty">No hay menús registrados aún.</div>
          ) : (
            <table className="app-table">
              <thead>
                <tr>
                  <SortableHeader label="Nombre" field="nombre" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} />
                  <th>Descripción</th>
                  <th>Entrante</th>
                  <th>Principal</th>
                  <th>Postre</th>
                  <th>Bebida</th>
                  <SortableHeader label="Precio" field="precio" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} align="right" />
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {sortedMenus.map(menu => (
                  <tr key={menu._id}>
                    <td>{menu.nombre}</td>
                    <td>{menu.descripcion}</td>
                    <td>{(menu.entrante as Dish)?.nombre || ""}</td>
                    <td>{(menu.principal as Dish)?.nombre || ""}</td>
                    <td>{(menu.postre as Dish)?.nombre || "-"}</td>
                    <td>{(menu.bebida as Drink)?.nombre || ""}</td>
                    <td className="price">€ {menu.precio.toFixed(2)}</td>
                    <td>
                      <label className="switch">
                        <input
                          type="checkbox"
                          checked={menu.activo}
                          onChange={() => toggleActivo(menu)}
                        />
                        <span className="slider round"></span>
                      </label>
                    </td>
                    <td>
                      <button
                        className="app-action-btn edit"
                        title="Editar"
                        onClick={() => { setEditMenu(menu); setShowModal(true); }}
                      >
                        <FaRegEdit />
                      </button>
                      <button
                        className="app-action-btn delete"
                        title="Eliminar"
                        onClick={() => setDeleteModal({ open: true, menuId: menu._id })}
                      >
                        <FaRegTrashAlt />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && (
          <div className="app-form-fullscreen">
            <div className="app-form-content">
              <button
                className="app-modal-close"
                onClick={handleCancel}
                aria-label="Cerrar"
              >
                ×
              </button>
              <h2 className="app-modal-title">
                {editMenu ? "Editar menú" : "Crear menú"}
              </h2>
              <MenuForm
                menu={editMenu}
                dishes={dishes}
                drinks={drinks}
                onSave={handleSaveMenu}
                onCancel={handleCancel}
              />
            </div>
          </div>
        )}

        {deleteModal.open && (
          <div className="modal-backdrop">
            <div className="modal-content">
              <p>¿Estás seguro de que quieres eliminar este menú?</p>
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
  field: keyof Menu;
  sortField: keyof Menu;
  sortAsc: boolean;
  onSort: (field: keyof Menu) => void;
  align?: "left" | "right";
}) {
  return (
    <th className={`${sortField === field ? "sort-active" : ""} ${align}`} onClick={() => onSort(field)}>
      {label} <span className="sort-arrow">{sortField === field ? (sortAsc ? "▲" : "▼") : "▲"}</span>
    </th>
  );
}
