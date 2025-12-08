// src/App.jsx
import React, { useState } from "react";
import Admin from "./Admin";
import Tienda from "./Tienda"; // Aquí deberías importar tu componente de tienda normal

function App() {
  const [modoAdmin, setModoAdmin] = useState(false);

  return (
    <div>
      {modoAdmin ? (
        <Admin />
      ) : (
        <>
          <button
            onClick={() => setModoAdmin(true)}
            style={{
              position: "fixed",
              top: 10,
              right: 10,
              padding: "10px 15px",
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              zIndex: 1000,
            }}
          >
            Abrir Panel de Admin
          </button>
          <Tienda />
        </>
      )}
    </div>
  );
}

export default App;
