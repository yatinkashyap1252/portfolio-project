import { Schema, model } from "mongoose";
import { ISEO } from "../types";

const seoSchema = new Schema<ISEO>(
  {
    metaTitle: {
      type: String,
      required: true,
      trim: true,
    },
    metaDescription: {
      type: String,
      required: true,
      trim: true,
    },
    keywords: {
      type: [String],
      required: true,
      default: [],
    },
    ogImageUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const SEO = model<ISEO>("SEO", seoSchema);
