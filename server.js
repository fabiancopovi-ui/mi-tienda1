// server.js
import express from "express";
import fs from "fs";
import path from "path";

const app = express();
app.use(express.json());

const PORT = 3000;
const productosPath = path.join("public", "productos.json");

// Endpoint GET para productos
app.get("/api/productos", (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(productosPath, "utf-8"));
    res.json({ productos: data });
  } catch (err) {
    res.status(500).json({ error: "No se pudo leer productos.json" });
  }
});

// Endpoint POST para agregar productos
app.post("/api/productos", (req, res) => {
  try {
    const { productos } = req.body;
    if (!Array.isArray(productos)) {
      return res.status(400).json({ error: "Formato inválido" });
    }
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
    res.json({ ok: true, productos });
  } catch (err) {
    res.status(500).json({ error: "No se pudo guardar productos.json" });
  }
});

// Servir archivos estáticos de React
app.use(express.static("dist"));

// Esto asegura que cualquier ruta devuelva index.html (para SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
