import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import recordsRouter from "./routes/records.js";

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/records", recordsRouter);

// Conexión a MongoDB
mongoose
  .connect("mongodb://localhost:27017/blood_pressure", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar MongoDB:", err));

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
