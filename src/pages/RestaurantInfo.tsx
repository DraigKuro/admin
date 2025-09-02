import { useState } from "react";
import Layout from "../components/Layout";
import RestaurantGeneralForm from "../components/forms/RestaurantGeneralForm";
import RestaurantContactForm from "../components/forms/RestaurantContactForm";
import RestaurantLocationForm from "../components/forms/RestaurantLocationForm";
import RestaurantLogoForm from "../components/forms/RestaurantLogoForm";
import { RestaurantProvider } from "../context/RestaurantContext";

import "../styles/restaurant-info.css";
import "../styles/restaurant-forms.css";

const TABS = [
    { key: "general", label: "General" },
    { key: "contact", label: "Contacto" },
    { key: "location", label: "Ubicación" },
    { key: "logo", label: "Logo" }
];

export default function RestaurantInfo() {
    const [tab, setTab] = useState("general");

    return (
        <Layout>
            <RestaurantProvider>
                <div className="restaurant-info-container">
                    <div className="restaurant-info-tabs">
                        {TABS.map((t) => (
                            <button
                                key={t.key}
                                className={tab === t.key ? "tab active" : "tab"}
                                onClick={() => setTab(t.key)}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>
                    <div className="restaurant-info-panel">
                        {tab === "general" && (
                            <div>
                                <h2>Datos generales</h2>
                                <RestaurantGeneralForm />
                            </div>
                        )}
                        {tab === "contact" && (
                            <div>
                                <h2>Contacto</h2>
                                <RestaurantContactForm />
                            </div>
                        )}
                        {tab === "location" && (
                            <div>
                                <h2>Ubicación</h2>
                                <RestaurantLocationForm />
                            </div>
                        )}
                        {tab === "logo" && (
                            <div>
                                <h2>Logo</h2>
                                <RestaurantLogoForm />
                            </div>
                        )}
                    </div>
                </div>
            </RestaurantProvider>
        </Layout>
    );
}
