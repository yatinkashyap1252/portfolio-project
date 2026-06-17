import { Router } from "express";
import {
  registerAdmin,
  login,
  verify2fa,
  setup2fa,
  verifySetup2fa,
  disable2fa,
  refreshTokens,
  logout,
  logoutAll,
} from "../controllers/authController";
import { requireAuth, require2faPending } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();

// Registration: Restricted to initial setup when no admin accounts exist
router.post("/register-admin", authLimiter, registerAdmin);

// Authentication: Rate-limited login and verification
router.post("/login", authLimiter, login);
router.post("/verify-2fa", authLimiter, require2faPending, verify2fa);

// 2FA Management (Requires active auth session)
router.get("/setup-2fa", requireAuth, setup2fa);
router.post("/verify-setup-2fa", requireAuth, verifySetup2fa);
router.post("/disable-2fa", requireAuth, disable2fa);

// Session Actions
router.post("/refresh", refreshTokens);
router.post("/logout", logout);
router.post("/logout-all", requireAuth, logoutAll);

export default router;
