import { Schema, model } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "../types"; // We will declare types later

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin"],
      default: "admin",
    },
    // 2FA Fields
    twoFactorSecret: {
      type: String,
      default: "",
    },
    twoFactorEnabled: {
      type: Boolean,
      default: false,
    },
    twoFactorBackupCodes: {
      type: [String], // Cryptographically secure hashes
      default: [],
    },
    // Refresh tokens (multiple device support / rotation tracking)
    refreshTokens: {
      type: [
        {
          tokenHash: { type: String, required: true },
          expiresAt: { type: Date, required: true },
          userAgent: { type: String, default: "" },
          ipAddress: { type: String, default: "" },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User = model<IUser>("User", userSchema);
