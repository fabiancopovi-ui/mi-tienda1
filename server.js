import express from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const productosPath = path.join(__dirname, "public", "productos.json");

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

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, "dist")));

// SPA: cualquier ruta devuelve index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
