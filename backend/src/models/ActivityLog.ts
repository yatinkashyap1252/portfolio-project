import { Schema, model } from "mongoose";
import { IActivityLog } from "../types";

const activityLogSchema = new Schema<IActivityLog>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "LOGIN_SUCCESS",
        "LOGIN_FAILED",
        "2FA_VERIFIED",
        "2FA_FAILED",
        "CONTENT_CHANGE",
        "FILE_UPLOAD",
        "FILE_DELETE",
        "LOGOUT",
        "PORTFOLIO_VISIT",
      ],
    },
    ipAddress: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema);
