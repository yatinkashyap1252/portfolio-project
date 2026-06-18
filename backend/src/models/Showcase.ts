import { Schema, model } from "mongoose";
import { IShowcase } from "../types";

const showcaseSchema = new Schema<IShowcase>(
  {
    type: {
      type: String,
      required: true,
      enum: ["certificate", "blog", "article", "extra-curricular", "highlight"],
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    subtitle: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: [String],
      required: true,
      default: [],
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    linkLabel: {
      type: String,
      required: true,
      trim: true,
    },
    badgeText: {
      type: String,
      required: true,
      trim: true,
    },
    bgStyle: {
      type: String,
      required: true,
      enum: ["white", "black", "red", "dark", "split"],
      default: "white",
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

export const Showcase = model<IShowcase>("Showcase", showcaseSchema);
