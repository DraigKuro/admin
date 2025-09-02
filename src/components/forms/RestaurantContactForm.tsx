import { useState, useEffect } from "react";
import { restaurantApi } from "../../api/restaurantApi";
import { useRestaurant } from "../../context/RestaurantContext";
import type { SocialLink } from "../../types/Restaurant";

import "../../styles/switch.css";

interface ContactData {
  email: string;
  phone: string;
  socialLinks: {
    facebook: SocialLink;
    instagram: SocialLink;
    twitter: SocialLink;
    tiktok: SocialLink;
  };
}

export default function RestaurantContactForm() {
  const { restaurant, refreshRestaurant } = useRestaurant();

  const [contactData, setContactData] = useState<ContactData>({
    email: "",
    phone: "",
    socialLinks: {
      facebook: { enabled: false, url: "" },
      instagram: { enabled: false, url: "" },
      twitter: { enabled: false, url: "" },
      tiktok: { enabled: false, url: "" },
    },
  });

  useEffect(() => {
    if (restaurant) {
      setContactData({
        email: restaurant.email || "",
        phone: restaurant.phone || "",
        socialLinks: {
          facebook: restaurant.socialLinks?.facebook || { enabled: false, url: "" },
          instagram: restaurant.socialLinks?.instagram || { enabled: false, url: "" },
          twitter: restaurant.socialLinks?.twitter || { enabled: false, url: "" },
          tiktok: restaurant.socialLinks?.tiktok || { enabled: false, url: "" },
        },
      });
    }
  }, [restaurant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name in contactData.socialLinks) {
      setContactData((prev) => ({
        ...prev,
        socialLinks: {
          ...prev.socialLinks,
          [name]: { ...prev.socialLinks[name as keyof typeof prev.socialLinks], url: value },
        },
      }));
    } else if (name === "email" || name === "telefono") {
      setContactData((prev) => ({
        ...prev,
        [name === "telefono" ? "phone" : "email"]: value,
      }));
    }
  };

  const handleToggle = (key: keyof ContactData["socialLinks"]) => {
    setContactData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [key]: { ...prev.socialLinks[key], enabled: !prev.socialLinks[key].enabled },
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await restaurantApi.updateContactInfo(contactData);
      await refreshRestaurant();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form className="restaurant-contact-form" onSubmit={handleSubmit}>
      <div>
        <label>Correo electrónico</label>
        <input
          type="email"
          name="email"
          value={contactData.email}
          onChange={handleInputChange}
          required
          title="Introduce un correo electrónico válido"
        />
      </div>

      <div>
        <label>Teléfono</label>
        <input
          type="tel"
          name="telefono"
          value={contactData.phone}
          onChange={handleInputChange}
          required
          pattern="^[0-9\s\-\+]{9,15}$"
          title="Introduce un teléfono válido (solo números, espacios, + o -)"
        />
      </div>

      <div>
        <label>Redes sociales</label>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            { key: "instagram", label: "Instagram", placeholder: "@usuario" },
            { key: "facebook", label: "Facebook", placeholder: "facebook.com/..." },
            { key: "tiktok", label: "TikTok", placeholder: "@usuario" },
            { key: "twitter", label: "X (Twitter)", placeholder: "@usuario" },
          ].map((r) => (
            <div
              key={r.key}
              style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <span style={{ minWidth: 70 }}>{r.label}</span>
              <input
                type="text"
                name={r.key}
                placeholder={r.placeholder}
                value={contactData.socialLinks[r.key as keyof typeof contactData.socialLinks].url}
                disabled={!contactData.socialLinks[r.key as keyof typeof contactData.socialLinks].enabled}
                onChange={handleInputChange}
                style={{ flex: 1 }}
              />
              <label className="switch">
                <input
                  type="checkbox"
                  checked={contactData.socialLinks[r.key as keyof typeof contactData.socialLinks].enabled}
                  onChange={() => handleToggle(r.key as keyof typeof contactData.socialLinks)}
                />
                <span className="switch-slider"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <button type="submit">Guardar</button>
    </form>
  );
}
