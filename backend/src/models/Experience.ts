import { Schema, model } from "mongoose";
import { IExperience } from "../types";

const experienceSchema = new Schema<IExperience>(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: [String],
      required: true,
      default: [],
    },
    skillsUsed: {
      type: [String],
      default: [],
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Experience = model<IExperience>("Experience", experienceSchema);
