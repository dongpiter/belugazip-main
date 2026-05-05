import { Router } from "express";
import cookieParser from "cookie-parser";
import { createHash } from "crypto";

const router = Router();
router.use(cookieParser());

const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "beluga2025";
const SESSION_SECRET = process.env["SESSION_SECRET"] ?? "secret_key_beluga";

function hashPassword(password: string): string {
  return createHash("sha256").update(password + SESSION_SECRET).digest("hex");
}

const VALID_TOKEN = hashPassword(ADMIN_PASSWORD);

router.post("/admin/login", (req, res) => {
  const { password } = req.body;
  if (!password) { res.status(400).json({ error: "Password required" }); return; }
  const token = hashPassword(password);
  if (token !== VALID_TOKEN) {
    res.status(401).json({ error: "Mật khẩu không đúng" }); return;
  }
  res.cookie("admin_token", VALID_TOKEN, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ success: true });
});

router.post("/admin/logout", (_req, res) => {
  res.clearCookie("admin_token");
  res.json({ success: true });
});

router.get("/admin/check", (req, res) => {
  const token = req.cookies?.admin_token;
  if (token === VALID_TOKEN) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

export default router;
