import React, { useState } from "react";

export default function Admin() {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [fotos, setFotos] = useState([]);

  const guardarProducto = async () => {
    if (!nombre || !precio || fotos.length === 0) {
      alert("Completa nombre, precio y sube al menos una foto.");
      return;
    }

    const carpeta = nombre.trim();
    const imagenes = fotos.map((f, i) => `${i + 1}.jpeg`);

    // Cargar el JSON actual
    let data = await fetch("/src/data.json").then(r => r.json());

    // Nuevo producto
    const nuevo = {
      id: nombre.toLowerCase().replace(/ /g, "-"),
      nombre,
      precio: Number(precio),
      carpeta,
      imagenes
    };

    data.productos.push(nuevo);

    // Guardar el JSON actualizado
    await fetch("/src/data.json", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data, null, 2)
    });

    alert("Producto guardado!");

    setNombre("");
    setPrecio("");
    setFotos([]);
  };

  return (
    <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
      <h1>Panel Admin</h1>

      <label>Nombre del producto</label>
      <input
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Precio</label>
      <input
        value={precio}
        onChange={(e) => setPrecio(e.target.value)}
        type="number"
        style={{ width: "100%", marginBottom: 10 }}
      />

      <label>Fotos (JPEG)</label>
      <input
        type="file"
        multiple
        accept="image/jpeg"
        onChange={(e) => setFotos([...e.target.files])}
        style={{ marginBottom: 10 }}
      />

      {fotos.length > 0 && (
        <p>{fotos.length} fotos seleccionadas</p>
      )}

      <button
        onClick={guardarProducto}
        style={{
          width: "100%",
          padding: 10,
          background: "black",
          color: "white",
          border: "none",
          borderRadius: 5,
          marginTop: 10
        }}
      >
        Guardar producto
      </button>
    </div>
  );
}
