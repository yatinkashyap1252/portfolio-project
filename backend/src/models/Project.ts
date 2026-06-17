import { Schema, model } from "mongoose";
import { IProject } from "../types";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    technologies: {
      type: [String],
      required: true,
      default: [],
    },
    githubUrl: {
      type: String,
      required: true,
      trim: true,
    },
    liveUrl: {
      type: String,
      trim: true,
    },
    thumbnailUrl: {
      type: String,
      required: true,
      default: "",
    },
    galleryUrls: {
      type: [String],
      default: [],
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isDraft: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Project = model<IProject>("Project", projectSchema);
