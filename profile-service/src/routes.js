const express = require("express");
const { PrismaClient } = require("@prisma/client");
const authenticateJWT = require("./jwtMiddleware");

const prisma = new PrismaClient();
const router = express.Router();

// 🔒 Require JWT for all routes
router.use(authenticateJWT);

// ✅ Get current user's profile
router.get("/profile/me", async (req, res) => {
  const userId = req.user.sub; // Extracted from JWT

  try {
    const profile = await prisma.userProfile.findUnique({ where: { userId } });
    if (!profile) return res.status(404).json({ message: "Profile not found" });
    res.json(profile);
  } catch (err) {
    console.error("Error fetching profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// ✅ Create new user profile
router.post("/profile", async (req, res) => {
  const userId = req.user.sub;
  const { bio, avatar, location } = req.body;

  try {
    const newProfile = await prisma.userProfile.create({
      data: { userId, bio, avatar, location },
    });
    res.status(201).json(newProfile);
  } catch (err) {
    console.error("Error creating profile:", err);
    res.status(400).json({ error: err.message });
  }
});

// ✅ Update existing user profile or create if not exists (UPSERT)
router.put("/profile", async (req, res) => {
  const userId = req.user.sub;

  // Extract fields from request body
  const { bio, avatar, location } = req.body;

  // Build data object with only defined fields
  const dataToUpdate = {};
  if (bio !== undefined) dataToUpdate.bio = bio;
  if (avatar !== undefined) dataToUpdate.avatar = avatar;
  if (location !== undefined) dataToUpdate.location = location;

  try {
    const updated = await prisma.userProfile.upsert({
      where: { userId },
      update: dataToUpdate,
      create: { userId, ...dataToUpdate },
    });
    res.json(updated);
  } catch (err) {
    console.error("Error upserting profile:", err);
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
