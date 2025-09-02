import { useEffect, useState } from "react";
import { useRestaurant } from "../../context/RestaurantContext";
import { restaurantApi } from "../../api/restaurantApi";

interface GeneralData {
    name: string;
    cif: string;
    openingHours: { open: string; close: string };
}

export default function RestaurantGeneralForm() {
    const { restaurant, setRestaurant, refreshRestaurant } = useRestaurant();
    const [formData, setFormData] = useState<GeneralData>({
        name: "",
        cif: "",
        openingHours: { open: "", close: "" },
    });

    useEffect(() => {
        if (restaurant) {
            setFormData({
                name: restaurant.name,
                cif: restaurant.cif,
                openingHours: restaurant.openingHours,
            });
        }
    }, [restaurant]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        if (name === "hora_apertura") {
            setFormData((prev) => ({
                ...prev,
                openingHours: { ...prev.openingHours, open: value },
            }));
        } else if (name === "hora_cierre") {
            setFormData((prev) => ({
                ...prev,
                openingHours: { ...prev.openingHours, close: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await restaurantApi.updateBasicInfo(formData);
            setRestaurant(formData);
            await refreshRestaurant();
        } catch (err) {
            console.error("Error al actualizar datos generales:", err);
        }
    };

    return (
        <form className="restaurant-general-form" onSubmit={handleSubmit}>
            <div>
                <label>Nombre del restaurante</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>
            <div>
                <label>CIF/NIF</label>
                <input
                    type="text"
                    name="cif"
                    value={formData.cif}
                    onChange={handleChange}
                    required
                    pattern="^[A-Za-z0-9]{8,9}$"
                    title="Debe tener 8 o 9 caracteres, letras y números, como 12345678Z o X1234567L"
                />
            </div>
            <div>
                <label>Horario de atención</label>
                <div>
                    <input
                        type="time"
                        name="hora_apertura"
                        value={formData.openingHours.open}
                        onChange={handleChange}
                        required
                    />
                    <span>a</span>
                    <input
                        type="time"
                        name="hora_cierre"
                        value={formData.openingHours.close}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <button type="submit">Guardar</button>
        </form>
    );
}
