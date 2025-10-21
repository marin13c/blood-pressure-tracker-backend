import { Router } from "express";
import Record from "../models/Record.js";

const router = Router();

// Crear registro
router.post("/", async (req, res) => {
  try {
    const record = new Record(req.body);
    await record.save();
    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener todos los registros
router.get("/", async (req, res) => {
  const records = await Record.find().sort({ date: -1 });
  res.json(records);
});

export default router;
