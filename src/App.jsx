import React, { useEffect, useState } from "react";
import Admin from "./Admin.jsx";

function App() {
  const [productos, setProductos] = useState([]);

  // Traer productos desde el servidor
  const fetchProductos = async () => {
    try {
      const res = await fetch("/api/productos");
      const data = await res.json();
      setProductos(data.productos || []);
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  return (
    <div>
      <h1>🛒 Mi Tienda</h1>
      
      {/* Panel de administración */}
      <Admin fetchProductos={fetchProductos} />

      {/* Lista de productos */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        {productos.map((p, index) => (
          <div key={index} style={{ border: "1px solid #ccc", padding: "1rem" }}>
            <h3>{p.nombre}</h3>
            <p>Precio: ${p.precio}</p>
            <p>Categoría: {p.categoria}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
