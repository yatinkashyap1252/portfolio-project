import { Document } from "mongoose";

export interface IRefreshTokenSession {
  tokenHash: string;
  expiresAt: Date;
  userAgent: string;
  ipAddress: string;
}

export interface IUser extends Document {
  email: string;
  password: string;
  role: "admin";
  twoFactorSecret: string;
  twoFactorEnabled: boolean;
  twoFactorBackupCodes: string[];
  refreshTokens: IRefreshTokenSession[];
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export interface IActivityLog extends Document {
  userId: string | null;
  email: string;
  action: "LOGIN_SUCCESS" | "LOGIN_FAILED" | "2FA_VERIFIED" | "2FA_FAILED" | "CONTENT_CHANGE" | "FILE_UPLOAD" | "FILE_DELETE" | "LOGOUT";
  ipAddress: string;
  userAgent: string;
  details: string;
  createdAt: Date;
}

export interface IHero extends Document {
  name: string;
  designation: string;
  headline: string;
  shortIntro: string;
  resumeUrl: string;
  profileImageUrl: string;
  githubUrl: string;
  linkedinUrl: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAbout extends Document {
  description: string;
  experienceYears: number;
  location: string;
  email: string;
  highlights: string[];
  signatureUrl: string;
  recruiterMessage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISkill extends Document {
  name: string;
  category: string;
  proficiency: number; // 0-100
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject extends Document {
  title: string;
  description: string;
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  thumbnailUrl: string;
  galleryUrls: string[];
  isFeatured: boolean;
  isDraft: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IExperience extends Document {
  companyName: string;
  position: string;
  duration: string; // e.g. "2024 - Present"
  description: string[];
  skillsUsed: string[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEducation extends Document {
  institution: string;
  degree: string;
  startDate: string;
  endDate: string;
  grade?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICertificate extends Document {
  name: string;
  issuer: string;
  date: string;
  credentialUrl: string;
  imageUrl?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IContact extends Document {
  email: string;
  phone?: string;
  location: string;
  githubUrl?: string;
  linkedinUrl?: string;
  twitterUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISEO extends Document {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  ogImageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IMedia extends Document {
  filename: string;
  publicId: string; // Cloudinary public_id
  url: string;
  format: string;
  bytes: number;
  folder: string;
  createdAt: Date;
}

export interface ISkillCategory extends Document {
  id: string; // e.g. "frontend"
  title: string;
  metric: string;
  description: string;
  visualizerType: "wave" | "matrix" | "nodes" | "gauge";
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IShowcase extends Document {
  type: "certificate" | "blog" | "article" | "extra-curricular" | "highlight";
  title: string;
  subtitle: string;
  content: string[];
  link: string;
  linkLabel: string;
  badgeText: string;
  bgStyle: "white" | "black" | "red" | "dark" | "split";
  imageUrl?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

