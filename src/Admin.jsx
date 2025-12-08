// src/Admin.jsx
import React, { useState, useEffect } from "react";

export default function Admin() {
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    categoria: "",
  });

  // Cargar productos desde API
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data.productos || []));
  }, []);

  const handleChange = (e) => {
    setNuevoProducto({ ...nuevoProducto, [e.target.name]: e.target.value });
  };

  const agregarProducto = () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;
    const updated = [...productos, nuevoProducto];
    setProductos(updated);
    setNuevoProducto({ nombre: "", precio: "", categoria: "" });

    // Guardar cambios en productos.json vía API (si ya tenés endpoint POST)
    fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos: updated }),
    });
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif", maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>🛒 Panel de Administración — Mi Tienda</h2>

      <div style={{ marginBottom: "20px", border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Agregar Producto</h3>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={nuevoProducto.nombre}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "5px", width: "calc(33% - 10px)" }}
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={nuevoProducto.precio}
          onChange={handleChange}
          style={{ padding: "8px", marginRight: "5px", width: "calc(33% - 10px)" }}
        />
        <input
          type="text"
          name="categoria"
          placeholder="Categoría"
          value={nuevoProducto.categoria}
          onChange={handleChange}
          style={{ padding: "8px", width: "calc(33% - 10px)" }}
        />
        <button
          onClick={agregarProducto}
          style={{
            display: "block",
            marginTop: "10px",
            padding: "10px 20px",
            backgroundColor: "#007BFF",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Agregar
        </button>
      </div>

      <div style={{ border: "1px solid #ccc", padding: "15px", borderRadius: "8px" }}>
        <h3>Productos Existentes</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Nombre</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Precio</th>
              <th style={{ borderBottom: "1px solid #ccc", textAlign: "left", padding: "8px" }}>Categoría</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((p, i) => (
              <tr key={i}>
                <td style={{ padding: "8px" }}>{p.nombre}</td>
                <td style={{ padding: "8px" }}>${p.precio}</td>
                <td style={{ padding: "8px" }}>{p.categoria}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
