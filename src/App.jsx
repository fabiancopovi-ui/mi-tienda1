// src/App.jsx
import React, { useEffect, useState } from "react";
import Admin from "./Admin.jsx";

function App() {
  const [productos, setProductos] = useState([]);
  const [mostrarAdmin, setMostrarAdmin] = useState(false);

  // Cargar productos desde API
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data.productos || []))
      .catch((err) => console.error("Error cargando productos:", err));
  }, []);

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <button
        onClick={() => setMostrarAdmin(!mostrarAdmin)}
        style={{
          padding: "10px 15px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          marginBottom: "20px",
        }}
      >
        {mostrarAdmin ? "Cerrar Panel Admin" : "Abrir Panel Admin"}
      </button>

      {mostrarAdmin ? (
        <Admin />
      ) : (
        <div>
          <h1>🛒 Mi Tienda</h1>
          <ul>
            {productos.map((p, i) => (
              <li key={i}>
                {p.nombre} - ${p.precio} - {p.categoria || "Sin categoría"}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
