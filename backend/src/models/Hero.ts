import { Schema, model } from "mongoose";
import { IHero } from "../types";

const heroSchema = new Schema<IHero>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    headline: {
      type: String,
      required: true,
      trim: true,
    },
    shortIntro: {
      type: String,
      required: true,
      trim: true,
    },
    resumeUrl: {
      type: String,
      required: true,
      default: "",
    },
    profileImageUrl: {
      type: String,
      required: true,
      default: "",
    },
    githubUrl: {
      type: String,
      required: true,
      default: "",
    },
    linkedinUrl: {
      type: String,
      required: true,
      default: "",
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Hero = model<IHero>("Hero", heroSchema);
