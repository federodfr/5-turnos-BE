import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/booking.router.js"

const app = express();

app.use(express.json());
app.use("/services", servicesRouter);
app.use("/bookings", bookingsRouter);

app.use((req, res) => {
  return res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "El body debe ser un JSON válido" });
  }

  return res.status(500).json({ error: err.message || "Error interno del servidor" });
});

export default app;
