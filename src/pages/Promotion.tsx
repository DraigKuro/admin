import { useState, useEffect, useMemo } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import Layout from "../components/Layout";
import PromotionForm from "../components/forms/PromotionForm";
import type { Promotion } from "../types/Promotion";
import type { Dish } from "../types/Dish";
import type { Drink } from "../types/Drink";
import { promotionApi } from "../api/promotionApi";
import { dishApi } from "../api/dishApi";
import { drinkApi } from "../api/drinkApi";
import "../styles/tables.css";
import "../styles/form.css";
import "../styles/modal.css";

export default function Promotions() {
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editPromotion, setEditPromotion] = useState<Promotion | null>(null);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; promotionId?: string }>({ open: false });

    const [sortField, setSortField] = useState<keyof Promotion>("nombre");
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [allDishes, allDrinks, allPromotions] = await Promise.all([
                    dishApi.getAll(),
                    drinkApi.getAll(),
                    promotionApi.getAll(),
                ]);
                setDishes(allDishes);
                setDrinks(allDrinks);
                setPromotions(allPromotions);
                console.log(allPromotions);
            } catch (err) {
                console.error("Error al cargar datos:", err);
            }
        }
        fetchData();
    }, []);

    const sortedPromotions = useMemo(() => {
        return [...promotions].sort((a, b) => {
            const valA = a[sortField];
            const valB = b[sortField];
            if (typeof valA === "number" && typeof valB === "number") {
                return sortAsc ? valA - valB : valB - valA;
            }
            return String(valA).toLowerCase().localeCompare(String(valB).toLowerCase()) * (sortAsc ? 1 : -1);
        });
    }, [promotions, sortField, sortAsc]);

    const toggleSort = (field: keyof Promotion) => {
        if (sortField === field) setSortAsc(!sortAsc);
        else {
            setSortField(field);
            setSortAsc(true);
        }
    };

    const handleSavePromotion = async (promotion: Promotion, file?: File) => {
        try {
            let saved: Promotion;
            if (editPromotion?._id) {
                saved = await promotionApi.update(editPromotion._id, promotion, file);
                setPromotions(promotions.map(p => p._id === editPromotion._id ? saved : p));
            } else {
                saved = await promotionApi.create(promotion, file);
                setPromotions([...promotions, saved]);
            }
            setShowModal(false);
            setEditPromotion(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleCancel = () => {
        setShowModal(false);
        setEditPromotion(null);
    };

    const toggleActivo = async (promotion: Promotion) => {
        try {
            const updated = await promotionApi.update(promotion._id!, { activo: !promotion.activo });
            setPromotions(promotions.map(p => p._id === promotion._id ? updated : p));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        if (!deleteModal.promotionId) return;
        try {
            await promotionApi.remove(deleteModal.promotionId);
            setPromotions(promotions.filter(p => p._id !== deleteModal.promotionId));
            setDeleteModal({ open: false });
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <Layout>
            <div className="page-content">
                <div className="app-header-row">
                    <h1>Promociones</h1>
                    <button
                        className="app-create-btn"
                        onClick={() => { setShowModal(true); setEditPromotion(null); }}
                    >
                        Crear promoción
                    </button>
                </div>

                <div className="app-table-container">
                    {promotions.length === 0 ? (
                        <div className="app-empty">No hay promociones registradas aún.</div>
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
                                    <SortableHeader label="Cantidad" field="cantidad" sortField={sortField} sortAsc={sortAsc} onSort={toggleSort} align="right" />
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedPromotions.map(promotion => (
                                    <tr key={promotion._id}>
                                        <td>{promotion.nombre}</td>
                                        <td>{promotion.descripcion}</td>
                                        <td>{(promotion.entrante as Dish)?.nombre || ""}</td>
                                        <td>{(promotion.principal as Dish)?.nombre || ""}</td>
                                        <td>{(promotion.postre as Dish)?.nombre || ""}</td>
                                        <td>{(promotion.bebida as Drink)?.nombre || ""}</td>
                                        <td className="price">€ {promotion.precio.toFixed(2)}</td>
                                        <td>{promotion.cantidad}</td>
                                        <td>
                                            <label className="switch">
                                                <input
                                                    type="checkbox"
                                                    checked={promotion.activo}
                                                    onChange={() => toggleActivo(promotion)}
                                                />
                                                <span className="slider round"></span>
                                            </label>
                                        </td>
                                        <td>
                                            <button
                                                className="app-action-btn edit"
                                                title="Editar"
                                                onClick={() => { setEditPromotion(promotion); setShowModal(true); }}
                                            >
                                                <FaRegEdit />
                                            </button>
                                            <button
                                                className="app-action-btn delete"
                                                title="Eliminar"
                                                onClick={() => setDeleteModal({ open: true, promotionId: promotion._id })}
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
                                {editPromotion ? "Editar promoción" : "Crear promoción"}
                            </h2>
                            <PromotionForm
                                promotion={editPromotion}
                                dishes={dishes}
                                drinks={drinks}
                                onSave={handleSavePromotion}
                                onCancel={handleCancel}
                            />
                        </div>
                    </div>
                )}

                {deleteModal.open && (
                    <div className="modal-backdrop">
                        <div className="modal-content">
                            <p>¿Estás seguro de que quieres eliminar esta promoción?</p>
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
    field: keyof Promotion;
    sortField: keyof Promotion;
    sortAsc: boolean;
    onSort: (field: keyof Promotion) => void;
    align?: "left" | "right";
}) {
    return (
        <th className={`${sortField === field ? "sort-active" : ""} ${align}`} onClick={() => onSort(field)}>
            {label} <span className="sort-arrow">{sortField === field ? (sortAsc ? "▲" : "▼") : "▲"}</span>
        </th>
    );
}
