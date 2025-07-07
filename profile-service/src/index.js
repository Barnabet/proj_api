const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authenticateJWT = require("./jwtMiddleware");
const profileRoutes = require("./routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Enable CORS for your frontend
app.use(cors({
  origin: "http://localhost:5173", // frontend origin autorisé
  credentials: true                // autoriser cookies & headers auth
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cookieParser());

// Health check
app.get("/health", (_, res) => res.json({ status: "profile-service OK" }));

// All routes protégées par JWT
app.use(authenticateJWT);
app.use("/api/v1", profileRoutes);

app.listen(PORT, () => {
  console.log(`Profile service running on http://localhost:${PORT}`);
});
