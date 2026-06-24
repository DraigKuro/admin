# Sabority Admin Web

Panel de administración web de [Sabority](https://github.com/DraigKuro/sabority), pensado para que el personal del restaurante gestione mesas, menú y pedidos en tiempo real.

Esta aplicación consume la [`sabority-api`](https://github.com/DraigKuro/sabority-api) y es el centro de operaciones del restaurante: mientras el cliente pide desde la mesa con la app Android ([`sabority-android`](https://github.com/DraigKuro/sabority-android)), el personal supervisa y gestiona todo desde aquí.

## Stack

- **TypeScript** + **React**
- Comunicación con la API mediante módulos dedicados por recurso (`dishApi`, `drinkApi`, `menuApi`, `orderApi`, `promotionApi`, `restaurantApi`, `tableApi`)

## Arquitectura

La aplicación centraliza su estado a través de un **Context** (`RestaurantContext`), que se encarga de:

- Hacer las llamadas iniciales a la API al arrancar la sesión (datos del restaurante, menú, estado de las mesas).
- Exponer esos datos y las funciones para modificarlos a toda la jerarquía de componentes mediante `useContext()`, evitando *prop drilling*.

Cada recurso del backend tiene su propio módulo de API en el frontend, que encapsula las peticiones HTTP (`GET`, `POST`, `PUT`, `DELETE`) y el manejo de errores de forma consistente.

El punto de entrada es `App.tsx`, donde se define la estructura general y el enrutado entre las distintas secciones.

## Secciones del panel

- **Inicio de sesión** — pantalla de login con email y contraseña.
- **Panel de órdenes** — vista principal con el estado de las mesas y los pedidos en curso.
- **Datos del restaurante** — configuración general, contacto, ubicación y logo, organizada en pestañas.
- **Platos y bebidas** — alta, edición y eliminación del catálogo, con imagen y categoría.
- **Menú** — composición de platos y bebidas en menús estructurados.
- **Promociones** — creación y gestión de ofertas temporales.
- **Mesas** — gestión del mapa de mesas y generación de su código QR.

## Estado del proyecto

- ✅ CRUD funcional contra la API para platos, bebidas, menús, promociones, restaurante y mesas.
- ✅ Gestión de estado centralizada vía Context.
- ⚠️ La pantalla de login está construida en el front, pero **todavía no está conectada a una autenticación real** (la API aún no implementa JWT) — por ahora el acceso al panel no está protegido.

## Instalación

```bash
npm install
npm start
```

Configura la URL de la API en el `.env` correspondiente antes de arrancar.

## Contexto del proyecto

Este repositorio forma parte de [Sabority](https://github.com/DraigKuro/sabority), proyecto de fin de curso (2º DAM) compuesto por una API, esta web de administración y una app Android para el cliente, además de una primera versión web ([`sabority-web-legacy`](https://github.com/DraigKuro/sabority-web-legacy)) que dio origen al proyecto.
