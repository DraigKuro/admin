import { useState, useEffect } from "react";
import type { Table } from "../../types/Table";

interface TableFormProps {
  table: Table | null;
  onSave: (table: Partial<Table>) => void;
  onCancel: () => void;
}

export default function TableForm({ table, onSave, onCancel }: TableFormProps) {
  const [form, setForm] = useState<Partial<Table>>({
    nombre: table?.nombre || "",
    activo: table?.activo ?? true,
  });

  useEffect(() => {
    if (table) {
      setForm({ nombre: table.nombre, activo: table.activo });
    } else {
      setForm({ nombre: "", activo: true });
    }
  }, [table]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(form);
  }

  return (
    <form className="app-form" onSubmit={handleSubmit}>
      <div className="app-form-row">
        <label>
          Nombre de la mesa
          <input
            name="nombre"
            value={form.nombre || ""}
            onChange={handleChange}
            required
          />
        </label>
      </div>
      <div className="app-form-row">
        <label>
          Activo
          <input
            name="activo"
            type="checkbox"
            checked={form.activo ?? true}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className="app-form-actions">
        <button type="submit" className="app-save-btn">Guardar</button>
        <button type="button" className="app-cancel-btn" onClick={onCancel}>Cancelar</button>
      </div>
    </form>
  );
}
