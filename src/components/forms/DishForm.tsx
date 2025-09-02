import { useState, useEffect } from "react";
import type { Dish } from "../../types/Dish";

interface DishFormProps {
    dish: Dish | null;
    onSave: (dish: Dish, file?: File) => void;
    onCancel: () => void;
}

export default function DishForm({ dish, onSave, onCancel }: DishFormProps) {
    const API_BASE = import.meta.env.VITE_API_BASE_URL;
    const [form, setForm] = useState<Dish>(
        dish || {
            _id: undefined,
            nombre: "",
            categoria: "",
            descripcion: "",
            precio: 0,
            imagen: undefined,
            activo: true,
        }
    );

    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (dish) setForm(dish);
    }, [dish]);

    function handleChange(
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) {
        const { name, value, type } = e.target;
        let fieldValue: string | boolean | number = value;

        if (type === "checkbox") {
            fieldValue = (e.target as HTMLInputElement).checked;
        } else if (type === "number") {
            fieldValue = parseFloat(value);
        }

        setForm((prev) => ({
            ...prev,
            [name]: fieldValue,
        }));
    }

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        onSave(form, file || undefined);
    }

    return (
        <form className="dishes-form" onSubmit={handleSubmit}>
            <div className="dishes-form-row">
                <label>
                    Nombre
                    <input
                        name="nombre"
                        className="dishes-form-input"
                        value={form.nombre}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div className="dishes-form-row">
                <label>
                    Categoría
                    <select
                        name="categoria"
                        className="dishes-form-input"
                        value={form.categoria}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecciona una categoría</option>
                        <option value="Entrante">Entrante</option>
                        <option value="Principal">Principal</option>
                        <option value="Postre">Postre</option>
                    </select>
                </label>

                <label>
                    Precio (€)
                    <input
                        name="precio"
                        className="dishes-form-input"
                        type="number"
                        step="0.01"
                        value={form.precio}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div className="dishes-form-row">
                <label>
                    Descripción
                    <textarea
                        name="descripcion"
                        value={form.descripcion}
                        onChange={handleChange}
                        required
                    />
                </label>
            </div>

            <div className="dishes-form-row">
                <label>
                    Activo
                    <input
                        name="activo"
                        type="checkbox"
                        checked={form.activo}
                        onChange={handleChange}
                    />
                </label>
            </div>

            <div className="dishes-form-row">
                <label>
                    Imagen
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                </label>
                {form.imagen && !file && (
                    <div>
                        <small>Imagen actual:</small>
                        <img src={`${API_BASE}${form.imagen}`} alt={form.nombre} style={{ maxWidth: 100, display: "block", marginTop: 5 }} />
                    </div>
                )}
            </div>

            <div className="dishes-form-actions">
                <button type="submit" className="dishes-save-btn">
                    Guardar
                </button>
                <button type="button" className="dishes-cancel-btn" onClick={onCancel}>
                    Cancelar
                </button>
            </div>
        </form>
    );
}