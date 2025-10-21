import mongoose from "mongoose";

const recordSchema = new mongoose.Schema({
  systolic: Number, // Presión sistólica
  diastolic: Number, // Presión diastólica
  pulse: Number, // Pulso (opcional)
  date: { type: Date, default: Date.now },
  notes: String,
});

export default mongoose.model("Record", recordSchema);
