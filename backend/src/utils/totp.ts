import { authenticator } from "otplib";
import QRCode from "qrcode";
import crypto from "crypto";
import bcrypt from "bcrypt";

// Explicit setup of Authenticator
authenticator.options = {
  window: 1, // Allow 1-step clock skew (30 seconds before/after)
};

/**
 * Generates a new TOTP secret and keyuri.
 */
export const generate2faSecret = (email: string) => {
  const secret = authenticator.generateSecret();
  const keyuri = authenticator.keyuri(email, "PortfolioCMS", secret);
  return { secret, keyuri };
};

/**
 * Generates QR code as a base64 DataURL.
 */
export const generateQrCodeDataUrl = async (keyuri: string): Promise<string> => {
  return QRCode.toDataURL(keyuri);
};

/**
 * Validates a TOTP token against the user's secret.
 */
export const verifyTotpToken = (token: string, secret: string): boolean => {
  return authenticator.verify({ token, secret });
};

/**
 * Generates 10 cryptographically secure backup recovery codes.
 * Returns both plain text array (to show user once) and hashed array (to save in DB).
 */
export const generateBackupCodes = async (): Promise<{ plain: string[]; hashed: string[] }> => {
  const plain: string[] = [];
  const hashed: string[] = [];

  for (let i = 0; i < 10; i++) {
    // Generate an 8-character uppercase alphanumeric code
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    plain.push(code);

    // Hash the code
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(code, salt);
    hashed.push(hash);
  }

  return { plain, hashed };
};

/**
 * Verifies if a given code matches any hashed backup code.
 * If yes, returns index so the code can be consumed and removed.
 */
export const verifyBackupCode = async (
  code: string,
  hashedCodes: string[]
): Promise<number> => {
  for (let i = 0; i < hashedCodes.length; i++) {
    const isMatch = await bcrypt.compare(code, hashedCodes[i]);
    if (isMatch) {
      return i; // Index of matching code
    }
  }
  return -1; // No match
};
