import React, { useEffect, useState } from "react";
import { useStore } from "./store";
import "./App.css";

export default function App() {
  const { productos, cargarProductos, agregarAlCarrito, carrito, quitarDelCarrito, cambiarCantidad, vaciarCarrito } = useStore();
  const [mostrarCarrito, setMostrarCarrito] = useState(false);
  const [sliderIndex, setSliderIndex] = useState({}); // índice de cada slider por producto

  useEffect(() => {
    cargarProductos();
  }, []);

  const nextImage = (id, fotosLength) => {
    setSliderIndex(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1 < fotosLength ? (prev[id] || 0) + 1 : 0
    }));
  };

  const prevImage = (id, fotosLength) => {
    setSliderIndex(prev => ({
      ...prev,
      [id]: (prev[id] || 0) - 1 >= 0 ? (prev[id] || 0) - 1 : fotosLength - 1
    }));
  };

  return (
    <div className="App">
      {/* --- Header --- */}
      <header className="header">
        <h1>ZYF.IMPORT</h1>
        <div className="carrito" onClick={() => setMostrarCarrito(!mostrarCarrito)}>
          🛒 Ver carrito ({Object.values(carrito || {}).reduce((sum, item) => sum + item.qty, 0)})
        </div>
      </header>

      {/* --- Panel carrito --- */}
      {mostrarCarrito && (
        <div className="carrito-panel">
          <h2>Tu carrito</h2>
          {Object.keys(carrito || {}).length === 0 ? (
            <p>Carrito vacío</p>
          ) : (
            <div>
              {Object.values(carrito || {}).map((item) => (
                <div key={item.id} className="carrito-item">
                  <span>{item.nombre}</span>
                  <span>${item.precio.toFixed(2)}</span>
                  <div>
                    <button onClick={() => cambiarCantidad(item.id, item.qty - 1)}>-</button>
                    <span>{item.qty}</span>
                    <button onClick={() => cambiarCantidad(item.id, item.qty + 1)}>+</button>
                    <button onClick={() => quitarDelCarrito(item.id)}>❌</button>
                  </div>
                </div>
              ))}

              {/* Total de precios */}
              <div className="total">
                Total: ${Object.values(carrito || {}).reduce((sum, i) => sum + (i.precio * i.qty || 0), 0).toFixed(2)}
              </div>

              <button className="vaciar" onClick={vaciarCarrito}>Vaciar carrito</button>
            </div>
          )}
        </div>
      )}

      {/* --- Productos --- */}
      <main className="productos-container">
        {productos.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          productos.map((p) => {
            const index = sliderIndex[p.id] || 0;
            return (
              <div key={p.id} className="producto-card">
                <div className="slider-container">
                  {p.fotos && p.fotos.length > 0 && (
                    <>
                      <img className="slider-img" src={p.fotos[index]} alt={`Imagen del producto ${p.nombre}`} />
                      {p.fotos.length > 1 && (
                        <div className="slider-buttons">
                          <button onClick={() => prevImage(p.id, p.fotos.length)}>◀</button>
                          <button onClick={() => nextImage(p.id, p.fotos.length)}>▶</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
                <h3>{p.nombre}</h3>
                <p>${p.precio.toFixed(2)}</p>
                <button onClick={() => agregarAlCarrito(p)}>Agregar al carrito</button>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
