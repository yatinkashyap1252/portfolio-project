import { Schema, model } from "mongoose";
import { ICertificate } from "../types";

const certificateSchema = new Schema<ICertificate>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    issuer: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    credentialUrl: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Certificate = model<ICertificate>("Certificate", certificateSchema);
