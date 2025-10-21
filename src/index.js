import "dotenv/config.js";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { connectDB } from "./config/db.js";
import recordsRoutes from "./routes/records.js";

const app = express();

const corsOrigins = process.env.CORS_ORIGIN?.split(",") || [
  "http://localhost:3000",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // Postman / móvil sin origin
      if (corsOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("No permitido por CORS"));
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/records", recordsRoutes);

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  app.listen(process.env.PORT, () =>
    console.log(`🚀 API en http://localhost:${process.env.PORT}`)
  );
};

start();
