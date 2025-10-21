// routes/users.js
import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Registro
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password });
  await user.save();
  res.status(201).json({ message: "Usuario creado" });
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: "Usuario no encontrado" });

  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: "Contraseña incorrecta" });

  const token = jwt.sign(
    { id: user._id, name: user.name },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
  res.json({ token, name: user.name });
});

// Obtener perfil
router.get("/me", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No autorizado" });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(401).json({ error: "Token inválido" });
  }
});

export default router;
