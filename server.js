const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Servir archivos estáticos (public)
app.use(express.static(path.join(__dirname, "public")));

// Endpoint API para productos
app.get("/api/productos", (req, res) => {
  const productosPath = path.join(__dirname, "public", "productos.json");
  if (fs.existsSync(productosPath)) {
    const data = fs.readFileSync(productosPath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.json({ productos: [] });
  }
});

// Servir React para cualquier otra ruta (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
