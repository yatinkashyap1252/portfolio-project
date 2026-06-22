import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../models/User";
import { ActivityLog } from "../models/ActivityLog";
import {
  generateAccessToken,
  generate2faPendingToken,
  generateRandomToken,
  hashToken,
} from "../utils/jwt";
import {
  generate2faSecret,
  generateQrCodeDataUrl,
  verifyTotpToken,
  generateBackupCodes,
  verifyBackupCode,
} from "../utils/totp";

// Helper to set refresh token cookie
const setRefreshCookie = (res: Response, token: string) => {
  const isProd = process.env.NODE_ENV === "production";
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: "/api/v1/auth", // only send to auth endpoints
  });
};

/**
 * Register Initial Admin
 * ONLY ALLOWED IF NO ADMIN EXISTS YET
 */
export const registerAdmin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const adminCount = await User.countDocuments({ role: "admin" });
    if (adminCount > 0) {
      return res.status(403).json({ message: "An admin account is already registered." });
    }

    const newAdmin = new User({ email, password, role: "admin" });
    await newAdmin.save();

    await ActivityLog.create({
      userId: newAdmin._id,
      email: newAdmin.email,
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Initial admin account registered.",
    });

    return res.status(201).json({ message: "Admin account registered successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Step 1: Initial Login Verification (Email + Password)
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // Log failure
      await ActivityLog.create({
        userId: null,
        email,
        action: "LOGIN_FAILED",
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "unknown",
        details: "Login failed: User not found.",
      });
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      // Log failure
      await ActivityLog.create({
        userId: user._id,
        email: user.email,
        action: "LOGIN_FAILED",
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "unknown",
        details: "Login failed: Incorrect password.",
      });
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      const pending2faToken = generate2faPendingToken(user._id.toString());
      return res.json({
        status: "PENDING_2FA",
        token: pending2faToken,
        message: "Two-factor verification required.",
      });
    }

    // Direct Login (No 2FA)
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRandomToken();
    const tokenHash = hashToken(refreshToken);

    // Save refresh session in User record
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({
      tokenHash,
      expiresAt,
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip || "127.0.0.1",
    });
    await user.save();

    setRefreshCookie(res, refreshToken);

    await ActivityLog.create({
      userId: user._id,
      email: user.email,
      action: "LOGIN_SUCCESS",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Logged in successfully (Direct).",
    });

    return res.json({
      accessToken,
      user: { email: user.email, role: user.role, twoFactorEnabled: false },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Step 2: Verify 2FA Code (TOTP or Backup Code)
 */
export const verify2fa = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { code } = req.body;

    if (!userId || !code) {
      return res.status(400).json({ message: "User ID and code are required." });
    }

    const user = await User.findById(userId);
    if (!user || !user.twoFactorEnabled) {
      return res.status(401).json({ message: "Invalid 2FA session parameters." });
    }

    let isAuthorized = false;
    let isBackupUsed = false;

    // Check TOTP Token (6 digits)
    if (code.length === 6 && /^\d+$/.test(code)) {
      isAuthorized = verifyTotpToken(code, user.twoFactorSecret);
    } else {
      // Check backup recovery code (8-character hex code)
      const codeIndex = await verifyBackupCode(code.toUpperCase(), user.twoFactorBackupCodes);
      if (codeIndex !== -1) {
        isAuthorized = true;
        isBackupUsed = true;
        // Consume the backup code
        user.twoFactorBackupCodes.splice(codeIndex, 1);
      }
    }

    if (!isAuthorized) {
      await ActivityLog.create({
        userId: user._id,
        email: user.email,
        action: "2FA_FAILED",
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"] || "unknown",
        details: `Failed 2FA code attempt: ${isBackupUsed ? "Backup code" : "TOTP code"}.`,
      });
      return res.status(401).json({ message: "Invalid verification code." });
    }

    // Generate valid tokens
    const accessToken = generateAccessToken(user._id.toString(), user.role);
    const refreshToken = generateRandomToken();
    const tokenHash = hashToken(refreshToken);

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens.push({
      tokenHash,
      expiresAt,
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip || "127.0.0.1",
    });
    await user.save();

    setRefreshCookie(res, refreshToken);

    await ActivityLog.create({
      userId: user._id,
      email: user.email,
      action: "2FA_VERIFIED",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `2FA verification success${isBackupUsed ? " (using Backup code)" : ""}.`,
    });

    return res.json({
      accessToken,
      user: { email: user.email, role: user.role, twoFactorEnabled: true },
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Step 3: Setup 2FA Request
 */
export const setup2fa = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Generate secret and keyuri
    const { secret, keyuri } = generate2faSecret(user.email);
    const qrCodeDataUrl = await generateQrCodeDataUrl(keyuri);
    const { plain: backupCodes, hashed: hashedBackup } = await generateBackupCodes();

    // Store temporarily in memory-like response (client will send this back to confirm setup)
    // We do NOT save it to User yet. Setup is only finalized once verified.
    return res.json({
      secret,
      qrCodeDataUrl,
      backupCodes,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Step 4: Verify and Enable 2FA Setup
 */
export const verifySetup2fa = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { code, secret, backupCodes } = req.body; // backupCodes holds the plain or hashed recovery codes

    if (!userId || !code || !secret || !backupCodes) {
      return res.status(400).json({ message: "Verification parameters are missing." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isValid = verifyTotpToken(code, secret);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid verification token. Setup failed." });
    }

    // Setup is valid. Hash backup codes if they aren't already hashed
    // We expect backupCodes as array of hashes, or plain texts
    const hashedCodes: string[] = [];
    for (const c of backupCodes) {
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(c, salt);
      hashedCodes.push(hash);
    }

    user.twoFactorSecret = secret;
    user.twoFactorEnabled = true;
    user.twoFactorBackupCodes = hashedCodes;
    await user.save();

    await ActivityLog.create({
      userId: user._id,
      email: user.email,
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Two-Factor Authentication (2FA) successfully set up and enabled.",
    });

    return res.json({ message: "Two-factor authentication successfully enabled." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Disable 2FA
 */
export const disable2fa = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { code } = req.body; // Require current TOTP code to disable

    if (!userId || !code) {
      return res.status(400).json({ message: "Verification code is required." });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isValid = verifyTotpToken(code, user.twoFactorSecret);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid verification token. Disabling 2FA failed." });
    }

    user.twoFactorSecret = "";
    user.twoFactorEnabled = false;
    user.twoFactorBackupCodes = [];
    await user.save();

    await ActivityLog.create({
      userId: user._id,
      email: user.email,
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Two-Factor Authentication (2FA) disabled.",
    });

    return res.json({ message: "Two-factor authentication disabled successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Refresh Tokens Rotation Logic
 */
export const refreshTokens = async (req: Request, res: Response) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;
    if (!oldRefreshToken) {
      return res.status(401).json({ message: "Refresh token is missing." });
    }

    const oldTokenHash = hashToken(oldRefreshToken);
    // Find the user who owns this refresh token hash
    const user = await User.findOne({ "refreshTokens.tokenHash": oldTokenHash });

    if (!user) {
      // Potential malicious token reuse attempt or token theft!
      // Invalidate all tokens for safety (token rotation protection).
      // We don't know who the user is from the client, but if the client has a refresh token that once belonged to someone,
      // it might have been stolen. However, since we can't search without hash, if a token is completely random and wrong,
      // we just return 401. But if the token was rotated and someone is reusing it, we must delete all.
      // Wait, we can parse the token or search the DB if we want, but since it's a random string, we can't extract user ID without the DB matching it.
      // If a user has already deleted it, the token is not found. To catch reuse, we should log rotated tokens,
      // or we can structure the refresh session to store expired/consumed tokens for a short window.
      // For simplicity, let's look up the token. If not found, return 401.
      return res.status(401).json({ message: "Invalid refresh token." });
    }

    // Find the session in the array
    const sessionIndex = user.refreshTokens.findIndex((s) => s.tokenHash === oldTokenHash);
    const session = user.refreshTokens[sessionIndex];

    // Check expiration
    if (session.expiresAt < new Date()) {
      // Expired session: delete it
      user.refreshTokens.splice(sessionIndex, 1);
      await user.save();
      return res.status(401).json({ message: "Refresh token has expired." });
    }

    // Session is valid: Rotate the Refresh Token
    const newRefreshToken = generateRandomToken();
    const newTokenHash = hashToken(newRefreshToken);

    // Update current session index with rotated hash and updated duration
    const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    user.refreshTokens[sessionIndex] = {
      tokenHash: newTokenHash,
      expiresAt: newExpiresAt,
      userAgent: req.headers["user-agent"] || "unknown",
      ipAddress: req.ip || "127.0.0.1",
    };
    await user.save();

    const newAccessToken = generateAccessToken(user._id.toString(), user.role);
    setRefreshCookie(res, newRefreshToken);

    return res.json({
      accessToken: newAccessToken,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Logout Session
 */
export const logout = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      // Delete specific token from user sessions
      const user = await User.findOne({ "refreshTokens.tokenHash": tokenHash });
      if (user) {
        user.refreshTokens = user.refreshTokens.filter((s) => s.tokenHash !== tokenHash);
        await user.save();

        await ActivityLog.create({
          userId: user._id,
          email: user.email,
          action: "LOGOUT",
          ipAddress: req.ip || "127.0.0.1",
          userAgent: req.headers["user-agent"] || "unknown",
          details: "Logged out session successfully.",
        });
      }
    }

    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/api/v1/auth",
    });

    return res.json({ message: "Logged out successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

/**
 * Logout from all active sessions
 */
export const logoutAll = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.refreshTokens = [];
    await user.save();

    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      path: "/api/v1/auth",
    });

    await ActivityLog.create({
      userId: user._id,
      email: user.email,
      action: "LOGOUT",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Logged out of all active devices / sessions.",
    });

    return res.json({ message: "Successfully logged out from all sessions/devices." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};
