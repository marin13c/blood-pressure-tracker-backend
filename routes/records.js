import express from "express";
import Record from "../models/Record.js";
import excelJS from "exceljs";
import PDFDocument from "pdfkit";
import fs from "fs";

const router = express.Router();

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

// Descargar en Excel
router.get("/export/excel", async (req, res) => {
  const records = await Record.find().sort({ date: -1 });
  const workbook = new excelJS.Workbook();
  const worksheet = workbook.addWorksheet("Presión Arterial");

  worksheet.columns = [
    { header: "Fecha", key: "date", width: 20 },
    { header: "Sistólica", key: "systolic", width: 15 },
    { header: "Diastólica", key: "diastolic", width: 15 },
    { header: "Pulso", key: "pulse", width: 10 },
    { header: "Notas", key: "notes", width: 25 },
  ];

  records.forEach((r) =>
    worksheet.addRow({
      date: r.date.toLocaleString(),
      systolic: r.systolic,
      diastolic: r.diastolic,
      pulse: r.pulse || "",
      notes: r.notes || "",
    })
  );

  res.setHeader(
    "Content-Type",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  );
  res.setHeader("Content-Disposition", "attachment; filename=presion.xlsx");

  await workbook.xlsx.write(res);
  res.end();
});

// Descargar en PDF
router.get("/export/pdf", async (req, res) => {
  const records = await Record.find().sort({ date: -1 });
  const doc = new PDFDocument();

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=presion.pdf");

  doc.pipe(res);
  doc.fontSize(18).text("Historial de Presión Arterial", { align: "center" });
  doc.moveDown();

  records.forEach((r) => {
    doc
      .fontSize(12)
      .text(
        `${r.date.toLocaleString()} | ${r.systolic}/${
          r.diastolic
        } mmHg | Pulso: ${r.pulse || "-"} | ${r.notes || ""}`
      );
  });

  doc.end();
});

export default router;
