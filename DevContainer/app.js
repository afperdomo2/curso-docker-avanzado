const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint simple
app.get("/", (req, res) => {
  res.send("¡Hola Mundo!");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto http://localhost:${PORT}`);
});
