import { Schema, model } from "mongoose";
import { IMedia } from "../types";

const mediaSchema = new Schema<IMedia>(
  {
    filename: {
      type: String,
      required: true,
      trim: true,
    },
    publicId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
    format: {
      type: String,
      required: true,
      trim: true,
    },
    bytes: {
      type: Number,
      required: true,
    },
    folder: {
      type: String,
      required: true,
      default: "portfolio",
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Media = model<IMedia>("Media", mediaSchema);
