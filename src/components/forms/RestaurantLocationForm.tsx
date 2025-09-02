import { useState, useEffect } from "react";
import { useRestaurant } from "../../context/RestaurantContext";
import { restaurantApi } from "../../api/restaurantApi";

interface LocationData {
  address: string;
  reference: string;
  mapUrl: string;
}

export default function RestaurantLocationForm() {
  const { restaurant, setRestaurant, refreshRestaurant } = useRestaurant();

  const [locationData, setLocationData] = useState<LocationData>({
    address: "",
    reference: "",
    mapUrl: "",
  });

  useEffect(() => {
    if (restaurant) {
      setLocationData({
        address: restaurant.address || "",
        reference: restaurant.reference || "",
        mapUrl: restaurant.mapUrl || "",
      });
    }
  }, [restaurant]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocationData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await restaurantApi.updateAddressInfo(locationData);
      setRestaurant({ ...restaurant, ...locationData }); // Actualizamos el context
      await refreshRestaurant(); // Opcional: refrescar datos completos
    } catch (err) {
      console.error("Error al actualizar ubicación:", err);
    }
  };

  return (
    <form className="restaurant-location-form" onSubmit={handleSubmit}>
      <div>
        <label>Dirección</label>
        <input
          type="text"
          name="address"
          value={locationData.address}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Referencia</label>
        <input
          type="text"
          name="reference"
          value={locationData.reference}
          onChange={handleChange}
        />
      </div>
      <div>
        <label>Mapa (URL)</label>
        <input
          type="url"
          name="mapUrl"
          value={locationData.mapUrl}
          onChange={handleChange}
          placeholder="https://maps.google.com/..."
        />
      </div>
      <button type="submit">Guardar</button>
    </form>
  );
}
