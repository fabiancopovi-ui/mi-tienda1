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
      .then((data) => setProductos(data.productos || []));
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <button onClick={() => setMostrarAdmin(!mostrarAdmin)}>
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
                {p.nombre} - ${p.precio} - {p.categoria}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
