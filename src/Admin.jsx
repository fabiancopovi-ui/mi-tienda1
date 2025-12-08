import React, { useState, useEffect } from "react";

function AdminPanel() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [categoria, setCategoria] = useState("");

  // Traer productos desde el backend
  useEffect(() => {
    fetch("/api/productos")
      .then((res) => res.json())
      .then((data) => setProductos(data.productos || []));
  }, []);

  // Agregar un producto nuevo
  const agregarProducto = () => {
    if (!nombre || !precio) return alert("Completa nombre y precio");
    const nuevoProducto = { nombre, precio, categoria };
    const actualizados = [...productos, nuevoProducto];

    fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos: actualizados }),
    })
      .then((res) => res.json())
      .then(() => {
        setProductos(actualizados);
        setNombre("");
        setPrecio("");
        setCategoria("");
      });
  };

  // Borrar un producto
  const borrarProducto = (index) => {
    const actualizados = productos.filter((_, i) => i !== index);
    fetch("/api/productos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productos: actualizados }),
    }).then(() => setProductos(actualizados));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🛒 Panel de Administración — Mi Tienda</h1>

      <h2>Agregar Producto</h2>
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
      <input
        type="text"
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

      <h2>Productos Existentes</h2>
      <ul>
        {productos.map((prod, index) => (
          <li key={index}>
            {prod.nombre} - ${prod.precio}{" "}
            <button onClick={() => borrarProducto(index)}>Borrar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPanel;
