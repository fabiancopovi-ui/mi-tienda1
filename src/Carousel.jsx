import React, { useState } from "react";

export default function Carousel({ fotos = [], alt = "" }) {
  const [index, setIndex] = useState(0);

  if (!fotos || fotos.length === 0) return null;

  const next = () => setIndex((i) => (i + 1) % fotos.length);
  const prev = () => setIndex((i) => (i - 1 + fotos.length) % fotos.length);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <img
        src={fotos[index]}
        alt={alt}
        style={{
          width: "100%",
          height: "250px",      // Altura fija
          borderRadius: 10,
          objectFit: "cover",   // Ajusta y recorta la imagen si es necesario
        }}
      />

      {fotos.length > 1 && (
        <>
          {/* Botón Anterior */}
          <button
            onClick={prev}
            style={{
              position: "absolute",
              top: "50%",
              left: 5,
              transform: "translateY(-50%)",
              background: "#0009",
              color: "white",
              border: "none",
              borderRadius: 5,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            ‹
          </button>

          {/* Botón Siguiente */}
          <button
            onClick={next}
            style={{
              position: "absolute",
              top: "50%",
              right: 5,
              transform: "translateY(-50%)",
              background: "#0009",
              color: "white",
              border: "none",
              borderRadius: 5,
              padding: "6px 10px",
              cursor: "pointer",
            }}
          >
            ›
          </button>
        </>
      )}
    </div>
  );
}
