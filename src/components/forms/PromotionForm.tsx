import { useState } from "react";
import type { Promotion } from "../../types/Promotion";
import type { Dish } from "../../types/Dish";
import type { Drink } from "../../types/Drink";

interface PromotionFormProps {
  promotion: Promotion | null;
  dishes: Dish[];
  drinks: Drink[];
  onSave: (promotion: Promotion, file?: File) => void;
  onCancel: () => void;
}

export default function PromotionForm({ promotion, dishes, drinks, onSave, onCancel }: PromotionFormProps) {
  const [form, setForm] = useState<Promotion>({
    nombre: promotion?.nombre || "",
    descripcion: promotion?.descripcion || "",
    entrante: typeof promotion?.entrante === "string" ? promotion.entrante : promotion?.entrante?._id || "",
    principal: typeof promotion?.principal === "string" ? promotion.principal : promotion?.principal?._id || "",
    postre: promotion?.postre ? (typeof promotion.postre === "string" ? promotion.postre : promotion.postre._id) : "",
    bebida: typeof promotion?.bebida === "string" ? promotion.bebida : promotion?.bebida?._id || "",
    precio: promotion?.precio || 0,
    cantidad: promotion?.cantidad || 1,
    activo: promotion?.activo ?? true,
    imagen: promotion?.imagen || "",
    _id: promotion?._id,
  });

  const [imageFile, setImageFile] = useState<File | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else if (type === "number") {
      setForm(prev => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form, imageFile ?? undefined);
  }

  return (
    <form className="dishes-form" onSubmit={handleSubmit}>
      <div className="dishes-form-row">
        <label>Nombre
          <input name="nombre" className="dishes-form-input" value={form.nombre} onChange={handleChange} required />
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Descripción
          <textarea name="descripcion" value={form.descripcion} onChange={handleChange} required />
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Entrante (opcional)
          <select name="entrante" value={typeof form.entrante === "string" ? form.entrante : form.entrante?._id || ""} onChange={handleChange}>
            <option value="">Selecciona un entrante</option>
            {dishes.filter(d => d.categoria === "Entrante").map(d => (
              <option key={d._id} value={d._id}>{d.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Plato Principal (opcional)
          <select name="principal" value={typeof form.principal === "string" ? form.principal : form.principal?._id || ""} onChange={handleChange}>
            <option value="">Selecciona un principal</option>
            {dishes.filter(d => d.categoria === "Principal").map(d => (
              <option key={d._id} value={d._id}>{d.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Postre (opcional)
          <select name="postre" value={typeof form.postre === "string" ? form.postre : form.postre?._id || ""} onChange={handleChange}>
            <option value="">Sin postre</option>
            {dishes.filter(d => d.categoria === "Postre").map(d => (
              <option key={d._id} value={d._id}>{d.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Bebida
          <select name="bebida" value={typeof form.bebida === "string" ? form.bebida : form.bebida?._id || ""} onChange={handleChange} required>
            <option value="">Selecciona una bebida</option>
            {drinks.map(dr => (
              <option key={dr._id} value={dr._id}>{dr.nombre}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Precio (€)
          <input name="precio" type="number" step="0.01" value={form.precio} onChange={handleChange} required />
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Cantidad máxima
          <input name="cantidad" type="number" min={1} value={form.cantidad} onChange={handleChange} required />
        </label>
      </div>

      <div className="dishes-form-row">
        <label>Imagen
          <input name="imagen" type="file" accept="image/*" onChange={handleImageChange} />
        </label>
      </div>

      <div className="dishes-form-row">
        <label>
          Activo
          <input name="activo" type="checkbox" checked={form.activo} onChange={handleChange} />
        </label>
      </div>

      <div className="dishes-form-actions">
        <button type="submit" className="dishes-save-btn">Guardar</button>
        <button type="button" className="dishes-cancel-btn" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
