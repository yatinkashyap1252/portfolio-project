import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "default_access_secret_123456789";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret_123456789";
const PENDING_2FA_SECRET = process.env.JWT_2FA_PENDING_SECRET || "default_2fa_pending_secret_123456789";

export interface IAccessPayload {
  userId: string;
  role: string;
}

export interface IPending2faPayload {
  userId: string;
  pending2fa: boolean;
}

export const generateAccessToken = (userId: string, role: string = "admin"): string => {
  return jwt.sign({ userId, role }, ACCESS_SECRET, { expiresIn: "15m" });
};

export const generate2faPendingToken = (userId: string): string => {
  return jwt.sign({ userId, pending2fa: true }, PENDING_2FA_SECRET, { expiresIn: "5m" });
};

export const generateRandomToken = (): string => {
  return crypto.randomBytes(40).toString("hex");
};

export const hashToken = (token: string): string => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const verifyAccessToken = (token: string): IAccessPayload => {
  return jwt.verify(token, ACCESS_SECRET) as IAccessPayload;
};

export const verify2faPendingToken = (token: string): IPending2faPayload => {
  return jwt.verify(token, PENDING_2FA_SECRET) as IPending2faPayload;
};
