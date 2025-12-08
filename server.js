import express from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "dist"))); // React build

// Config Multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/productos"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Endpoint GET productos
app.get("/api/productos", (req, res) => {
  const productosPath = path.join(__dirname, "public", "productos.json");
  const data = fs.existsSync(productosPath) ? JSON.parse(fs.readFileSync(productosPath, "utf-8")) : { productos: [] };
  res.json(data);
});

// Endpoint POST para agregar producto con imagen
app.post("/api/productos", upload.single("imagen"), (req, res) => {
  const productosPath = path.join(__dirname, "public", "productos.json");
  const productos = fs.existsSync(productosPath) ? JSON.parse(fs.readFileSync(productosPath, "utf-8")) : { productos: [] };

  const { nombre, precio } = req.body;
  const imagen = req.file ? `/productos/${req.file.filename}` : "";

  productos.productos.push({ nombre, precio, imagen });

  fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
  res.json({ success: true, producto: { nombre, precio, imagen } });
});

// Endpoint DELETE producto por índice
app.delete("/api/productos/:index", (req, res) => {
  const productosPath = path.join(__dirname, "public", "productos.json");
  const productos = fs.existsSync(productosPath) ? JSON.parse(fs.readFileSync(productosPath, "utf-8")) : { productos: [] };

  const index = parseInt(req.params.index);
  if (productos.productos[index]) {
    productos.productos.splice(index, 1);
    fs.writeFileSync(productosPath, JSON.stringify(productos, null, 2));
    res.json({ success: true });
  } else res.status(404).json({ success: false, error: "Producto no encontrado" });
});

// Servir React para cualquier otra ruta
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
