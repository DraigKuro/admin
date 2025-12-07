import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from 'react';

import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import RestaurantInfo from "./pages/RestaurantInfo";
import Dishes from "./pages/Dishes";
import Drinks from "./pages/Drinks";
import Menus from "./pages/Menus";
import Promotions from './pages/Promotion';
import Tables from "./pages/Tables";
import Register from "./pages/Register";

import './App.css'

const nombreRestaurante = 'Saborify 🍽️';

export default function App() {
  useEffect(() => {
    document.title = nombreRestaurante;
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurant-info" element={<RestaurantInfo />} />
        <Route path="/dishes" element={<Dishes />} />
        <Route path="/drinks" element={<Drinks />} />
        <Route path="/menus" element={<Menus />} />
        <Route path="/promotions" element={<Promotions />} />
        <Route path="/tables" element={<Tables />} />
      </Routes>
    </BrowserRouter>
  );
}
