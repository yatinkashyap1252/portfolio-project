import { Schema, model } from "mongoose";
import { IContact } from "../types";

const contactSchema = new Schema<IContact>(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    githubUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
    twitterUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

export const Contact = model<IContact>("Contact", contactSchema);
