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
      required: false,
      default: "",
    },
    profileImageUrl: {
      type: String,
      required: false,
      default: "",
    },
    githubUrl: {
      type: String,
      required: false,
      default: "",
    },
    linkedinUrl: {
      type: String,
      required: false,
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
