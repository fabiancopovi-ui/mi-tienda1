// server.js
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Servir archivos estáticos de la carpeta dist
app.use(express.static(path.join(__dirname, "dist")));

// Endpoint para productos
app.get("/api/productos", (req, res) => {
  const productosPath = path.join(__dirname, "public", "productos.json");
  if (fs.existsSync(productosPath)) {
    const data = fs.readFileSync(productosPath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.json({ productos: [] });
  }
});

// Para cualquier otra ruta, servir index.html (SPA)
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
