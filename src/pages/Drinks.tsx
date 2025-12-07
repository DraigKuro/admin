import { useState, useEffect, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import DrinkForm from "../components/forms/DrinkForm";
import type { Drink } from "../types/Drink";
import { drinkApi } from "../api/drinkApi";
import "../styles/tables.css";
import "../styles/form.css";
import "../styles/modal.css";

export default function Drinks() {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [sortField, setSortField] = useState<keyof Drink>("nombre");
    const [sortAsc, setSortAsc] = useState(true);
    const [showFormModal, setShowFormModal] = useState(false);
    const [editDrink, setEditDrink] = useState<Drink | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; drinkId?: string }>({ open: false });

    useEffect(() => {
        async function fetchDrinks() {
            try {
                const data = await drinkApi.getAll();
                setDrinks(data);
            } catch (err) {
                console.error("Error al cargar bebidas:", err);
            }
        }
        fetchDrinks();
    }, []);

    const sortedDrinks = useMemo(() => {
        return [...drinks].sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];
            if (typeof valA === "number" && typeof valB === "number") {
                return sortAsc ? valA - valB : valB - valA;
            }
            return String(valA).toLowerCase().localeCompare(String(valB).toLowerCase()) * (sortAsc ? 1 : -1);
        });
    }, [drinks, sortField, sortAsc]);

    const toggleSort = (field: keyof Drink) => {
        if (sortField === field) setSortAsc(!sortAsc);
        else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.drinkId) return;
        try {
            await drinkApi.remove(deleteModal.drinkId);
            setDrinks(drinks.filter(d => d._id !== deleteModal.drinkId));
            setDeleteModal({ open: false });
        } catch (err) {
            console.error(err);
        }
    };

    const toggleActivo = async (drink: Drink) => {
        try {
            const updated = await drinkApi.update(drink._id!, { activo: !drink.activo });
            setDrinks(drinks.map(d => d._id === drink._id ? updated : d));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSaveDrink = async (drink: Drink, file?: File) => {
        try {
            let saved: Drink;
            if (editDrink?._id) {
                saved = await drinkApi.update(editDrink._id, drink, file);
                setDrinks(drinks.map(d => d._id === editDrink._id ? saved : d));
            } else {
                saved = await drinkApi.create(drink, file);
                setDrinks([...drinks, saved]);
            }
            setShowFormModal(false);
            setEditDrink(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setShowFormModal(false);
        setEditDrink(null);
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="app-header-row">
                    <h1>Bebidas</h1>
                    <button
                        className="app-create-btn"
                        onClick={() => { setShowFormModal(true); setEditDrink(null); }}
                    >
                        Crear bebida
                    </button>
                </div>

                <div className="app-table-container">
                    {drinks.length === 0 ? (
                        <div className="app-empty">No hay bebidas registradas aún.</div>
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
                                {sortedDrinks.map(drink => (
                                    <tr key={drink._id || drink.nombre}>
                                        <td>{drink.nombre}</td>
                                        <td>{drink.tipo}</td>
                                        <td>{drink.descripcion}</td>
                                        <td className="price">€ {drink.precio.toFixed(2)}</td>
                                        <td>
                                            <label className="switch">
                                                <input type="checkbox" checked={drink.activo} onChange={() => toggleActivo(drink)} />
                                                <span className="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <button className="app-action-btn edit" title="Editar" onClick={() => { setEditDrink(drink); setShowFormModal(true); }}>
                                                <FaRegEdit />
                                            </button>
                                            <button className="app-action-btn delete" title="Eliminar" onClick={() => setDeleteModal({ open: true, drinkId: drink._id })}>
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
                            <button className="app-modal-close" onClick={handleCancel} aria-label="Cerrar">×</button>
                            <h2 className="app-modal-title">{editDrink ? "Editar bebida" : "Crear bebida"}</h2>
                            <DrinkForm drink={editDrink} onSave={handleSaveDrink} onCancel={handleCancel} />
                        </div>
                    </div>
                )}

                {deleteModal.open && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <p>¿Estás seguro de que quieres eliminar esta bebida?</p>
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
    field: keyof Drink;
    sortField: keyof Drink;
    sortAsc: boolean;
    onSort: (field: keyof Drink) => void;
    align?: "left" | "right";
}) {
    return (
        <th className={`${sortField === field ? "sort-active" : ""} ${align}`} onClick={() => onSort(field)}>
            {label} <span className="sort-arrow">{sortField === field ? (sortAsc ? "▲" : "▼") : "▲"}</span>
        </th>
    );
}
