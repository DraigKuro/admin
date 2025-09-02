import { useState, useEffect } from "react";
import { restaurantApi } from "../../api/restaurantApi";
import { useRestaurant } from "../../context/RestaurantContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export default function RestaurantLogoForm() {
  const { restaurant, setRestaurant } = useRestaurant();
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (restaurant?.logoUrl) {
      setLogoUrl(restaurant.logoUrl);
    }
  }, [restaurant]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    try {
      const updated = await restaurantApi.updateLogo(file);
      setLogoUrl(updated.logoUrl);
      setFile(null);
      setRestaurant(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoveLogo = async () => {
    if (!restaurant?._id) return;
    try {
      await restaurantApi.deleteLogo(restaurant._id);
      setLogoUrl("");
      setFile(null);
      setRestaurant({ ...restaurant, logoUrl: "" });
    } catch (err) {
      console.error("Error al eliminar logo:", err);
    }
  };

  return (
    <form className="restaurant-logo-form" onSubmit={handleSubmit}>
      <div>
        <label>Logo actual / previsualización</label>
        <div className="logo-preview-container">
          {file ? (
            <img src={URL.createObjectURL(file)} alt="Nuevo logo" />
          ) : logoUrl ? (
            <img src={`${API_BASE}${logoUrl}`} alt="Logo actual" />
          ) : (
            <span>No hay logo</span>
          )}
        </div>
      </div>

      <div>
        <label>Subir nuevo logo</label>
        <input type="file" name="logo" accept="image/*" onChange={handleFileChange} />
      </div>

      <div style={{ display: "flex", gap: "1rem" }}>
        <button type="submit">Guardar</button>
        {logoUrl && (
          <button type="button" onClick={handleRemoveLogo}>
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
}
