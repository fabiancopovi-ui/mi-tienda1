// server.js
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Necesario para usar __dirname en ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Servir archivos estáticos de la build de Vite
app.use(express.static(path.join(__dirname, "dist")));

// Endpoint API para productos
app.get("/api/productos", (req, res) => {
  const productosPath = path.join(__dirname, "dist", "productos.json");
  if (fs.existsSync(productosPath)) {
    const data = fs.readFileSync(productosPath, "utf-8");
    res.json(JSON.parse(data));
  } else {
    res.json({ productos: [] });
  }
});

// Servir React SPA para cualquier otra ruta
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
