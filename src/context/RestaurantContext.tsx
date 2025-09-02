import { createContext, useState, useEffect, useContext } from "react";
import type { ReactNode } from "react";
import { restaurantApi } from "../api/restaurantApi";
import type { Restaurant } from "../types/Restaurant";

interface RestaurantContextType {
  restaurant: Restaurant | null;
  refreshRestaurant: () => Promise<void>;
  setRestaurant: (data: Partial<Restaurant>) => void;
}

const RestaurantContext = createContext<RestaurantContextType>({
  restaurant: null,
  refreshRestaurant: async () => {},
  setRestaurant: () => {},
});

interface ProviderProps {
  children: ReactNode;
}

export const RestaurantProvider = ({ children }: ProviderProps) => {
  const [restaurant, setRestaurantState] = useState<Restaurant | null>(null);

  const fetchRestaurant = async () => {
    try {
      const data = await restaurantApi.getRestaurant();
      setRestaurantState(data);
    } catch (err) {
      console.error("Error al cargar restaurante:", err);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  const refreshRestaurant = async () => {
    await fetchRestaurant();
  };

  const setRestaurant = (data: Partial<Restaurant>) => {
    setRestaurantState((prev) => ({ ...prev, ...data } as Restaurant));
  };

  return (
    <RestaurantContext.Provider value={{ restaurant, refreshRestaurant, setRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
};

export const useRestaurant = (): RestaurantContextType => {
  return useContext(RestaurantContext);
};
