import { Schema, model } from "mongoose";
import { IAbout } from "../types";

const aboutSchema = new Schema<IAbout>(
  {
    description: {
      type: String,
      required: true,
      trim: true,
    },
    experienceYears: {
      type: Number,
      required: true,
      default: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    signatureUrl: {
      type: String,
      required: true,
      default: "",
    },
    recruiterMessage: {
      type: String,
      required: true,
      default: "",
    },
  },
  { timestamps: true }
);

export const About = model<IAbout>("About", aboutSchema);
