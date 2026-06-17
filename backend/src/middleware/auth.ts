import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, verify2faPendingToken } from "../utils/jwt";

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. Authentication token missing." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);

    req.user = {
      userId: decoded.userId,
      role: decoded.role,
    };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Access token has expired. Please refresh session." });
    }
    return res.status(401).json({ message: "Invalid access token." });
  }
};

export const require2faPending = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verify2faPendingToken(token);

    req.user = {
      userId: decoded.userId,
      pending2fa: true,
    };
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "2FA session expired. Please log in again." });
    }
    return res.status(401).json({ message: "Invalid or corrupt 2FA session." });
  }
};
