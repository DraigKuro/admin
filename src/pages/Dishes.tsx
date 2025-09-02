import { useState, useEffect, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import DishForm from "../components/forms/DishForm";
import type { Dish } from "../types/Dish";
import { dishApi } from "../api/dishApi";
import "../styles/tables.css";
import "../styles/form.css";
import "../styles/modal.css";

export default function Dishes() {
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [sortField, setSortField] = useState<keyof Dish>("nombre");
    const [sortAsc, setSortAsc] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editDish, setEditDish] = useState<Dish | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; dishId?: string }>({ open: false });

    useEffect(() => {
        async function fetchDishes() {
            try {
                const data = await dishApi.getAll();
                setDishes(data);
            } catch (err) {
                console.error("Error al cargar platos:", err);
            }
        }
        fetchDishes();
    }, []);

    const sortedDishes = useMemo(() => {
        return [...dishes].sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];
            if (typeof valA === "number" && typeof valB === "number") {
                return sortAsc ? valA - valB : valB - valA;
            }
            return String(valA).toLowerCase().localeCompare(String(valB).toLowerCase()) * (sortAsc ? 1 : -1);
        });
    }, [dishes, sortField, sortAsc]);

    const toggleSort = (field: keyof Dish) => {
        if (sortField === field) setSortAsc(!sortAsc);
        else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.dishId) return;
        try {
            await dishApi.remove(deleteModal.dishId);
            setDishes(dishes.filter(d => d._id !== deleteModal.dishId));
            setDeleteModal({ open: false });
        } catch (err) {
            console.error(err);
        }
    };

    const toggleActivo = async (dish: Dish) => {
        try {
            const updated = await dishApi.update(dish._id!, { activo: !dish.activo });
            setDishes(dishes.map(d => d._id === dish._id ? updated : d));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="app-header-row">
                    <h1>Platos</h1>
                    <button className="app-create-btn" onClick={() => setShowFormModal(true)}>
                        Crear plato
                    </button>
                </div>

                <div className="app-table-container">
                    {dishes.length === 0 ? (
                        <div className="app-empty">No hay platos registrados aún.</div>
                    ) : (
                        <table className="app-table">
                            <thead>
                                <tr>
                                    <SortableHeader label="Nombre" field="nombre" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} />
                                    <th>Categoría</th>
                                    <th>Descripción</th>
                                    <SortableHeader label="Precio" field="precio" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} align="right" />
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedDishes.map(dish => (
                                    <tr key={dish._id || dish.nombre}>
                                        <td>{dish.nombre}</td>
                                        <td>{dish.categoria}</td>
                                        <td>{dish.descripcion}</td>
                                        <td className="price">€ {dish.precio.toFixed(2)}</td>
                                        <td>
                                            <label className="switch">
                                                <input type="checkbox" checked={dish.activo} onChange={() => toggleActivo(dish)} />
                                                <span className="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <button className="app-action-btn edit" title="Editar" onClick={() => { setEditDish(dish); setShowFormModal(true); }}>
                                                <FaRegEdit />
                                            </button>
                                            <button className="app-action-btn delete" title="Eliminar" onClick={() => setDeleteModal({ open: true, dishId: dish._id })}>
                                                <FaRegTrashAlt />
                                            </button>
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
                            <button className="app-modal-close" onClick={() => { setShowFormModal(false); setEditDish(null); }} aria-label="Cerrar">×</button>
                            <h2 className="app-modal-title">{editDish ? "Editar plato" : "Crear plato"}</h2>
                            <DishForm
                                dish={editDish}
                                onSave={async (newDish: Dish, file?: File) => {
                                    try {
                                        let saved: Dish;
                                        if (editDish?._id) {
                                            saved = await dishApi.update(editDish._id, newDish, file);
                                            setDishes(dishes.map(d => d._id === editDish._id ? saved : d));
                                        } else {
                                            saved = await dishApi.create(newDish, file);
                                            setDishes([...dishes, saved]);
                                        }
                                        setShowFormModal(false);
                                        setEditDish(null);
                                    } catch (err) {
                                        console.error(err);
                                    }
                                }}
                                onCancel={() => { setShowFormModal(false); setEditDish(null); }}
                            />
                        </div>
                    </div>
                )}

                {deleteModal.open && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <p>¿Estás seguro de que quieres eliminar este plato?</p>
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
    field: keyof Dish;
    sortField: keyof Dish;
    sortAsc: boolean;
    onSort: (field: keyof Dish) => void;
    align?: "left" | "right";
}) {
    return (
        <th className={`${sortField === field ? "sort-active" : ""} ${align}`} onClick={() => onSort(field)}>
            {label} <span className="sort-arrow">{sortField === field ? (sortAsc ? "▲" : "▼") : "▲"}</span>
        </th>
    );
}
