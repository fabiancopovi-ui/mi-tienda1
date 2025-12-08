import { create } from "zustand";

export const useStore = create((set, get) => ({
  productos: [],
  carrito: {},

  // 🔥 CARGAR DESDE /public/productos.json (EL CORRECTO)
  cargarProductos: async () => {
    try {
      const res = await fetch("/productos.json?_=" + Date.now()); 
      // ?_ evita cache y siempre carga el archivo actualizado

      const data = await res.json();
      set({ productos: data.productos });
    } catch (e) {
      console.error("Error cargando productos:", e);
    }
  },

  agregarAlCarrito: (item) => {
    const carrito = { ...get().carrito };
    if (carrito[item.id]) carrito[item.id].qty += 1;
    else carrito[item.id] = { ...item, qty: 1 };
    set({ carrito });
  },

  quitarDelCarrito: (id) => {
    const carrito = { ...get().carrito };
    delete carrito[id];
    set({ carrito });
  },

  cambiarCantidad: (id, qty) => {
    const carrito = { ...get().carrito };
    if (qty <= 0) delete carrito[id];
    else carrito[id].qty = qty;
    set({ carrito });
  },

  vaciarCarrito: () => set({ carrito: {} }),
}));
