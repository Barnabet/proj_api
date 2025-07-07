// gateway/src/server.js
// ----------------------
// Express + Passport Google OAuth2 + JWT (CommonJS style)
// ---------------------------------------------------------

const express = require("express");
const passport = require("passport");
const session = require("express-session");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// Load environment variables from .env file (at project root or in /gateway)
dotenv.config();
// Fallback: if not found in current working dir, also attempt to load root-level .env
dotenv.config({ path: path.resolve(__dirname, "../../.env"), override: false });

// --- ENV -------------------------------------------------------------------
const {
  PORT = 4000,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  JWT_SECRET = "super-secret-jwt-key",
  FRONTEND_ORIGIN = "http://localhost:5173",
} = process.env;

// Skip strict credential check during automated tests to avoid exit
if (process.env.NODE_ENV !== "test") {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    console.error("❌ Missing Google OAuth credentials in environment ✋🏽");
    process.exit(1);
  }
}

// --- PASSPORT STRATEGY ------------------------------------------------------
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Register Google OAuth strategy only when creds are present (skipped during tests)
if (GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        // TODO: Persist / update user record in DB here (using Prisma/TypeORM)
        return done(null, profile);
      }
    )
  );
}

// ---------------------------------------------------------------------------
const app = express();
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: "some-session-secret", // TODO: move to env var
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

// --- AUTH ROUTES ------------------------------------------------------------
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/auth/failure" }),
  (req, res) => {
    const user = req.user;

    const token = jwt.sign(
      {
        sub: user.id,
        email: user.emails && user.emails[0].value,
        name: user.displayName,
      },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    // In prod, set "secure: true" and consider SameSite=strict
    res.cookie("token", token, { httpOnly: true, sameSite: "lax" });
    res.redirect(`${FRONTEND_ORIGIN}/home`);
  }
);

app.get("/auth/failure", (_, res) => res.status(401).send("Google auth failed"));

app.get("/auth/logout", (req, res) => {
  // We rely on stateless JWT, so simply clear the cookie and redirect
  res.clearCookie("token", { httpOnly: true, sameSite: "lax" });
  res.redirect(FRONTEND_ORIGIN);
});

// --- JWT GUARD --------------------------------------------------------------
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader ? authHeader.split(" ")[1] : req.cookies.token;

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// --- PROTECTED ROUTES -------------------------------------------------------
app.get("/api/v1/hello", authenticateJWT, (req, res) => {
  res.json({ message: `Hello, ${req.user.name}!` });
});

// Example open route – health check
app.get("/health", (_, res) => res.json({ status: "ok" }));

// Export the configured Express instance (without listening) for tests & server entrypoint
module.exports = app;
