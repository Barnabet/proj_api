const express = require("express");
const router = express.Router();
const prisma = require("../prismaClient");

// GET /api/v1/profile
router.get("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Non authentifié" });

  try {
    const user = await prisma.user.findUnique({
      where: { googleId: req.user.sub },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

// PUT /api/v1/profile
router.put("/", async (req, res) => {
  if (!req.user) return res.status(401).json({ error: "Non authentifié" });

  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Nom requis" });

  try {
    const updatedUser = await prisma.user.update({
      where: { googleId: req.user.sub },
      data: { name },
    });

    res.json({ message: "Profil mis à jour", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Erreur serveur" });
  }
});

module.exports = router;
