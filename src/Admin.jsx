import React, { useState } from "react";

function Admin({ fetchProductos }) {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");

  const agregarProducto = async () => {
    if (!nombre || !precio || !categoria) return alert("Completa todos los campos");

    try {
      const res = await fetch("/api/productos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio, categoria }),
      });

      if (res.ok) {
        setNombre("");
        setPrecio("");
        setCategoria("");
        fetchProductos(); // Refrescar lista automáticamente
      } else {
        alert("Error al agregar producto");
      }
    } catch (error) {
      console.error(error);
      alert("Error al conectar con el servidor");
    }
  };

  return (
    <div style={{ border: "2px solid #333", padding: "1rem", marginBottom: "2rem" }}>
      <h2>🛒 Panel de Administración — Mi Tienda</h2>
      <div>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
        <input
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />
        <input
          type="text"
          placeholder="Categoría"
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
        />
        <button onClick={agregarProducto}>Agregar</button>
      </div>
    </div>
  );
}

export default Admin;
