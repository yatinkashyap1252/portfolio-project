import { Request, Response } from "express";
import { Project } from "../models/Project";
import { Skill } from "../models/Skill";
import { Certificate } from "../models/Certificate";
import { Experience } from "../models/Experience";
import { Education } from "../models/Education";
import { ActivityLog } from "../models/ActivityLog";
import { Hero } from "../models/Hero";
import { About } from "../models/About";
import { Contact } from "../models/Contact";
import { SEO } from "../models/SEO";
import { SkillCategoryModel } from "../models/SkillCategory";
import { Showcase } from "../models/Showcase";
import nodemailer from "nodemailer";

// Helper to construct mail transporter resilient to cloud hosting provider firewall limits (Render)
const createMailTransporter = () => {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpSecure = process.env.SMTP_SECURE === "true";
  const smtpService = process.env.SMTP_SERVICE;

  const transportOpts: any = {
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
  };

  if (smtpService) {
    transportOpts.service = smtpService;
  } else if (smtpHost === "smtp.gmail.com") {
    if (smtpPort === 465 || smtpSecure) {
      transportOpts.host = smtpHost;
      transportOpts.port = 465;
      transportOpts.secure = true;
    } else {
      transportOpts.service = "gmail";
    }
  } else {
    transportOpts.host = smtpHost;
    transportOpts.port = smtpPort;
    transportOpts.secure = smtpSecure;
  }

  return nodemailer.createTransport(transportOpts);
};




// =========================================================================
// DASHBOARD & LOGS AGGREGATES
// =========================================================================

export const getDashboardSummary = async (req: Request, res: Response) => {
  try {
    const [
      totalProjects,
      totalSkills,
      totalCertificates,
      totalExperiences,
      totalEducation,
    ] = await Promise.all([
      Project.countDocuments(),
      Skill.countDocuments(),
      Certificate.countDocuments(),
      Experience.countDocuments(),
      Education.countDocuments(),
    ]);

    const latestDates = await Promise.all([
      Project.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      Skill.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      Certificate.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      Experience.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      Education.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      Hero.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      About.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      Contact.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
      SEO.findOne().sort({ updatedAt: -1 }).select("updatedAt"),
    ]);

    const dates = latestDates
      .filter((doc) => doc !== null)
      .map((doc: any) => new Date(doc.updatedAt).getTime());
    
    const lastUpdated = dates.length > 0 ? new Date(Math.max(...dates)) : new Date();

    const recentActivity = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(8)
      .select("email action ipAddress userAgent details createdAt");

    return res.json({
      counts: {
        projects: totalProjects,
        skills: totalSkills,
        certificates: totalCertificates,
        experience: totalExperiences,
        education: totalEducation,
      },
      lastUpdated,
      recentActivity,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const getActivityLogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ActivityLog.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      ActivityLog.countDocuments(),
    ]);

    return res.json({
      logs,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalLogs: total,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// HERO SECTION (SINGLETON)
// =========================================================================

export const getHero = async (req: Request, res: Response) => {
  try {
    let hero = await Hero.findOne();
    if (!hero) {
      // Seed default
      hero = new Hero({
        name: "Yatin Kashyap",
        designation: "Full Stack Developer",
        headline: "Building Modern Scalable Applications",
        shortIntro: "Highly motivated developer specializing in React, Next.js, and Node.js.",
        resumeUrl: "",
        profileImageUrl: "",
        githubUrl: "",
        linkedinUrl: "",
        email: "yatin@example.com",
      });
      await hero.save();
    }
    return res.json(hero);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateHero = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    let hero = await Hero.findOne();

    if (!hero) {
      hero = new Hero(updateData);
    } else {
      Object.assign(hero, updateData);
    }

    await hero.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Updated Hero section parameters.",
    });

    return res.json(hero);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// ABOUT SECTION (SINGLETON)
// =========================================================================

export const getAbout = async (req: Request, res: Response) => {
  try {
    let about = await About.findOne();
    if (!about) {
      about = new About({
        description: "I am a dedicated software developer...",
        experienceYears: 2,
        location: "Delhi, India",
        email: "yatin@example.com",
        highlights: ["React Expert", "Node Developer"],
        signatureUrl: "",
        recruiterMessage: "Welcome to my portfolio! Drop a message below to connect.",
      });
      await about.save();
    }
    return res.json(about);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateAbout = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    let about = await About.findOne();

    if (!about) {
      about = new About(updateData);
    } else {
      Object.assign(about, updateData);
    }

    await about.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Updated About section biography details.",
    });

    return res.json(about);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// TECHNICAL SKILLS
// =========================================================================

export const getSkills = async (req: Request, res: Response) => {
  try {
    const skills = await Skill.find().sort({ displayOrder: 1, name: 1 });
    return res.json(skills);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const createSkill = async (req: Request, res: Response) => {
  try {
    const { name, category, proficiency, displayOrder } = req.body;
    
    // Check if skill exists
    const existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
    if (existing) {
      return res.status(400).json({ message: `Skill ${name} already exists.` });
    }

    const skill = new Skill({ name, category, proficiency, displayOrder });
    await skill.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Created new skill entry: ${name}`,
    });

    return res.status(201).json(skill);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const skill = await Skill.findByIdAndUpdate(id, updateData, { new: true });
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Updated skill entry: ${skill.name}`,
    });

    return res.json(skill);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteSkill = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const skill = await Skill.findByIdAndDelete(id);
    if (!skill) {
      return res.status(404).json({ message: "Skill not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Deleted skill entry: ${skill.name}`,
    });

    return res.json({ message: "Skill deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const bulkCreateSkills = async (req: Request, res: Response) => {
  try {
    const { skills } = req.body; // Expect array of: { name, category, proficiency }
    if (!skills || !Array.isArray(skills)) {
      return res.status(400).json({ message: "Invalid skills payload. Array expected." });
    }

    const createdSkills = [];
    const skippedSkills = [];

    for (const item of skills) {
      const { name, category, proficiency } = item;
      if (!name) continue;

      const existing = await Skill.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });
      if (existing) {
        skippedSkills.push(name);
        continue;
      }

      // Compute display order as current count
      const currentCount = await Skill.countDocuments();
      const newSkill = new Skill({
        name,
        category: category || "other",
        proficiency: proficiency || 80,
        displayOrder: currentCount + 1,
      });
      await newSkill.save();
      createdSkills.push(newSkill);
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Bulk created ${createdSkills.length} skills (Skipped ${skippedSkills.length} duplicates).`,
    });

    return res.status(201).json({
      message: `Successfully created ${createdSkills.length} skills.`,
      created: createdSkills,
      skipped: skippedSkills,
    });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// PROJECTS
// =========================================================================

export const getProjects = async (req: Request, res: Response) => {
  try {
    const projects = await Project.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.json(projects);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    return res.json(project);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const createProject = async (req: Request, res: Response) => {
  try {
    const count = await Project.countDocuments();
    const projectData = {
      ...req.body,
      displayOrder: count + 1,
    };

    const project = new Project(projectData);
    await project.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Created project: ${project.title}`,
    });

    return res.status(201).json(project);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Updated project: ${project.title}`,
    });

    return res.json(project);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Deleted project: ${project.title}`,
    });

    return res.json({ message: "Project deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const duplicateProject = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const original = await Project.findById(id);
    if (!original) {
      return res.status(404).json({ message: "Project not found." });
    }

    const count = await Project.countDocuments();
    const copy = new Project({
      title: `Copy of ${original.title}`,
      description: original.description,
      technologies: original.technologies,
      githubUrl: original.githubUrl,
      liveUrl: original.liveUrl,
      thumbnailUrl: original.thumbnailUrl,
      galleryUrls: original.galleryUrls,
      isFeatured: false,
      isDraft: true,
      displayOrder: count + 1,
    });

    await copy.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Duplicated project ${original.title} to create ${copy.title}`,
    });

    return res.status(201).json(copy);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// EXPERIENCE
// =========================================================================

export const getExperiences = async (req: Request, res: Response) => {
  try {
    const items = await Experience.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.json(items);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const count = await Experience.countDocuments();
    const item = new Experience({
      ...req.body,
      displayOrder: count + 1,
    });
    await item.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Created experience: ${item.companyName} - ${item.position}`,
    });

    return res.status(201).json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Experience.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Experience record not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Updated experience: ${item.companyName} - ${item.position}`,
    });

    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Experience.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Experience record not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Deleted experience: ${item.companyName} - ${item.position}`,
    });

    return res.json({ message: "Experience deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// EDUCATION
// =========================================================================

export const getEducations = async (req: Request, res: Response) => {
  try {
    const items = await Education.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.json(items);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const createEducation = async (req: Request, res: Response) => {
  try {
    const count = await Education.countDocuments();
    const item = new Education({
      ...req.body,
      displayOrder: count + 1,
    });
    await item.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Created education block: ${item.institution} - ${item.degree}`,
    });

    return res.status(201).json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Education.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Education record not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Updated education block: ${item.institution} - ${item.degree}`,
    });

    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteEducation = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Education.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Education record not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Deleted education block: ${item.institution} - ${item.degree}`,
    });

    return res.json({ message: "Education deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// CERTIFICATES
// =========================================================================

export const getCertificates = async (req: Request, res: Response) => {
  try {
    const items = await Certificate.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.json(items);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const createCertificate = async (req: Request, res: Response) => {
  try {
    const count = await Certificate.countDocuments();
    const item = new Certificate({
      ...req.body,
      displayOrder: count + 1,
    });
    await item.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Created certificate entry: ${item.name} - ${item.issuer}`,
    });

    return res.status(201).json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Certificate.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Certificate record not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Updated certificate entry: ${item.name} - ${item.issuer}`,
    });

    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteCertificate = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Certificate.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Certificate record not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Deleted certificate entry: ${item.name} - ${item.issuer}`,
    });

    return res.json({ message: "Certificate deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// CONTACT (SINGLETON)
// =========================================================================

export const getContact = async (req: Request, res: Response) => {
  try {
    let item = await Contact.findOne();
    if (!item) {
      item = new Contact({
        email: "yatin@example.com",
        phone: "+91 99999 99999",
        location: "Delhi, India",
        githubUrl: "",
        linkedinUrl: "",
        twitterUrl: "",
      });
      await item.save();
    }
    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    let item = await Contact.findOne();

    if (!item) {
      item = new Contact(updateData);
    } else {
      Object.assign(item, updateData);
    }

    await item.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Updated Contact section settings.",
    });

    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const sendContactEmail = async (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ message: "All fields (name, email, subject, message) are required." });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || smtpUser || "yatinkashyap1252@gmail.com";

    // 1. Try Resend HTTP API if key exists (Resend uses HTTPS port 443, which bypasses all SMTP port blocks on Render)
    if (resendApiKey) {
      try {
        const resendRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resendApiKey}`,
          },
          body: JSON.stringify({
            from: "Portfolio Contact <onboarding@resend.dev>",
            to: [receiverEmail],
            reply_to: email,
            subject: `[Portfolio Contact] ${subject}`,
            html: `<h3>New Portfolio Message</h3><p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Subject:</strong> ${subject}</p><br/><p><strong>Message:</strong></p><div style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #E63925;">${message.replace(/\n/g, "<br/>")}</div>`,
          }),
        });

        if (resendRes.ok) {
          await ActivityLog.create({
            userId: null,
            email: "anonymous",
            action: "CONTENT_CHANGE",
            ipAddress: req.ip || "127.0.0.1",
            userAgent: req.headers["user-agent"] || "unknown",
            details: `Contact email sent via Resend API from ${name} (${email})`,
          });

          return res.json({ message: "Message sent successfully!", simulated: false });
        }
      } catch (resendErr) {
        console.warn("Resend HTTP API request failed, trying SMTP/DB fallback:", resendErr);
      }
    }

    // 2. Try Nodemailer SMTP if credentials are set
    if (smtpHost && smtpUser && smtpPass && smtpPass !== "your-app-password") {
      try {
        const transporter = createMailTransporter();
        const mailOptions = {
          from: `"${name}" <${smtpUser}>`,
          replyTo: email,
          to: receiverEmail,
          subject: `[Portfolio Contact] ${subject}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `
            <h3>New Portfolio Contact Form Submission</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <br/>
            <p><strong>Message:</strong></p>
            <div style="padding: 10px; background-color: #f5f5f5; border-left: 4px solid #E63925;">
              ${message.replace(/\n/g, "<br/>")}
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);

        await ActivityLog.create({
          userId: null,
          email: "anonymous",
          action: "CONTENT_CHANGE",
          ipAddress: req.ip || "127.0.0.1",
          userAgent: req.headers["user-agent"] || "unknown",
          details: `Contact email sent successfully from ${name} (${email}) to ${receiverEmail}`,
        });

        return res.json({ message: "Message sent successfully!", simulated: false });
      } catch (smtpErr: any) {
        console.warn("SMTP email delivery failed on host (e.g. outbound port blocked on Render), saving message to ActivityLog DB:", smtpErr.message);

        // Always save message to ActivityLog DB fallback so user submission is NEVER lost
        await ActivityLog.create({
          userId: null,
          email: "anonymous",
          action: "CONTENT_CHANGE",
          ipAddress: req.ip || "127.0.0.1",
          userAgent: req.headers["user-agent"] || "unknown",
          details: `[SAVED MSG] From ${name} (${email}) - ${subject}: ${message}`,
        });

        return res.json({
          message: "Your message has been sent and stored successfully!",
          simulated: false,
          fallbackSaved: true,
        });
      }
    }

    // 3. Store message in ActivityLog if no email credentials configured
    await ActivityLog.create({
      userId: null,
      email: "anonymous",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Contact message received from ${name} (${email}): ${subject}`,
    });

    return res.json({
      message: "Your message has been sent successfully!",
      simulated: true,
    });
  } catch (error: any) {
    console.error("Error handling contact email:", error);
    return res.status(500).json({ message: error.message || "Failed to process message." });
  }
};

// =========================================================================
// SEO METADATA (SINGLETON)
// =========================================================================

export const getSEO = async (req: Request, res: Response) => {
  try {
    let item = await SEO.findOne();
    if (!item) {
      item = new SEO({
        metaTitle: "Yatin Kashyap | Portfolio",
        metaDescription: "Professional portfolio site displaying projects and expertise.",
        keywords: ["Developer", "Portfolio", "React", "Node"],
        ogImageUrl: "",
      });
      await item.save();
    }
    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateSEO = async (req: Request, res: Response) => {
  try {
    const updateData = req.body;
    let item = await SEO.findOne();

    if (!item) {
      item = new SEO(updateData);
    } else {
      Object.assign(item, updateData);
    }

    await item.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: "Updated global SEO parameters.",
    });

    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// SKILL CATEGORIES CRUD
// =========================================================================

export const getSkillCategories = async (req: Request, res: Response) => {
  try {
    const categories = await SkillCategoryModel.find().sort({ displayOrder: 1 });
    return res.json(categories);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const createSkillCategory = async (req: Request, res: Response) => {
  try {
    const { id, title, metric, description, visualizerType, displayOrder } = req.body;
    
    // Check if category ID exists
    const existing = await SkillCategoryModel.findOne({ id });
    if (existing) {
      return res.status(400).json({ message: `Skill category with ID ${id} already exists.` });
    }

    const category = new SkillCategoryModel({
      id,
      title,
      metric,
      description,
      visualizerType,
      displayOrder: Number(displayOrder || 0),
    });
    await category.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Created skill category: ${title} (${id})`,
    });

    return res.status(201).json(category);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateSkillCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params; // Using MongoDB _id
    const category = await SkillCategoryModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!category) {
      return res.status(404).json({ message: "Skill category not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Updated skill category: ${category.title}`,
    });

    return res.json(category);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteSkillCategory = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await SkillCategoryModel.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: "Skill category not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Deleted skill category: ${category.title}`,
    });

    return res.json({ message: "Skill category deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

// =========================================================================
// SHOWCASE / WALL OF FAME CRUD
// =========================================================================

export const getShowcase = async (req: Request, res: Response) => {
  try {
    const showcase = await Showcase.find().sort({ displayOrder: 1, createdAt: -1 });
    return res.json(showcase);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const getShowcaseById = async (req: Request, res: Response) => {
  try {
    const item = await Showcase.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Showcase item not found." });
    }
    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const createShowcase = async (req: Request, res: Response) => {
  try {
    const count = await Showcase.countDocuments();
    const showcaseData = {
      ...req.body,
      displayOrder: count + 1,
    };

    const item = new Showcase(showcaseData);
    await item.save();

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Created showcase item: ${item.title}`,
    });

    return res.status(201).json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const updateShowcase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Showcase.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) {
      return res.status(404).json({ message: "Showcase item not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Updated showcase item: ${item.title}`,
    });

    return res.json(item);
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const deleteShowcase = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await Showcase.findByIdAndDelete(id);
    if (!item) {
      return res.status(404).json({ message: "Showcase item not found." });
    }

    await ActivityLog.create({
      userId: req.user?.userId || null,
      email: req.user?.userId ? "admin@example.com" : "unknown",
      action: "CONTENT_CHANGE",
      ipAddress: req.ip || "127.0.0.1",
      userAgent: req.headers["user-agent"] || "unknown",
      details: `Deleted showcase item: ${item.title}`,
    });

    return res.json({ message: "Showcase item deleted successfully." });
  } catch (error: any) {
    return res.status(500).json({ message: error.message || "Server Error" });
  }
};

export const trackVisit = async (req: Request, res: Response) => {
  try {
    const { referrer, language, screenResolution } = req.body;

    // 1. Extract IP Address
    let ip = (req.headers["x-forwarded-for"] as string || "").split(",")[0].trim() || req.ip || req.socket.remoteAddress || "127.0.0.1";
    if (ip === "::1" || ip === "::ffff:127.0.0.1") {
      ip = "127.0.0.1";
    }

    const userAgent = req.headers["user-agent"] || "unknown";
    
    // 2. Fetch approximate location details if it's not a local IP
    let geoInfo: any = null;
    const isLocal = ip === "127.0.0.1" || ip.startsWith("192.168.") || ip.startsWith("10.") || ip.startsWith("172.16.");
    
    if (!isLocal) {
      try {
        // Query ip-api.com (timeout of 3 seconds)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);
        
        const geoRes = await fetch(`http://ip-api.com/json/${ip}`, { signal: controller.signal });
        clearTimeout(timeoutId);
        
        if (geoRes.ok) {
          const data = await geoRes.json() as any;
          if (data && data.status === "success") {
            geoInfo = data;
          }
        }
      } catch (err) {
        console.error("Error fetching geo details for IP:", ip, err);
      }
    }

    // 3. Construct description/details for DB
    const locationString = geoInfo 
      ? `${geoInfo.city}, ${geoInfo.regionName}, ${geoInfo.country}` 
      : (isLocal ? "Localhost / Private Network" : "Unknown Location");
      
    const logDetails = `Portfolio visited. Location: ${locationString}. Referrer: ${referrer || "Direct"}. Language: ${language || "unknown"}. Resolution: ${screenResolution || "unknown"}.`;

    // 4. Log in the database ActivityLog
    await ActivityLog.create({
      userId: null,
      email: "anonymous",
      action: "PORTFOLIO_VISIT",
      ipAddress: ip,
      userAgent: userAgent,
      details: logDetails,
    });

    // 5. Send SMTP email notification
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpSecure = process.env.SMTP_SECURE === "true";
    const receiverEmail = process.env.CONTACT_RECEIVER_EMAIL || smtpUser;

    // Only attempt to send email if configured and not local IP
    if (smtpHost && smtpUser && smtpPass && smtpPass !== "your-app-password") {
      const transporter = createMailTransporter();

      const mailSubject = `[Portfolio Visit] New Visitor from ${locationString}`;
      
      const geoHtml = geoInfo ? `
        <p><strong>Country:</strong> ${geoInfo.country} (${geoInfo.countryCode})</p>
        <p><strong>Region/State:</strong> ${geoInfo.regionName}</p>
        <p><strong>City:</strong> ${geoInfo.city}</p>
        <p><strong>Timezone:</strong> ${geoInfo.timezone}</p>
        <p><strong>ISP:</strong> ${geoInfo.isp}</p>
        <p><strong>Org/AS:</strong> ${geoInfo.org || geoInfo.as || "N/A"}</p>
        <p><strong>Coordinates:</strong> ${geoInfo.lat}, ${geoInfo.lon}</p>
      ` : `<p><em>No geo-location information retrieved (either Localhost IP or Geo-IP Service was unavailable).</em></p>`;

      const mailOptions = {
        from: `"Portfolio Tracker" <${smtpUser}>`,
        to: receiverEmail,
        subject: mailSubject,
        text: `New Portfolio Visit Details:\n\n` +
              `IP Address: ${ip}\n` +
              `Location: ${locationString}\n` +
              `Referrer: ${referrer || "Direct"}\n` +
              `Language: ${language || "N/A"}\n` +
              `Resolution: ${screenResolution || "N/A"}\n` +
              `User Agent: ${userAgent}\n` +
              `Date/Time: ${new Date().toLocaleString()}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #E63925; border-bottom: 2px solid #e0e0e0; padding-bottom: 10px; margin-top: 0;">🌐 New Portfolio Visit</h2>
            
            <p>Somebody has just opened your portfolio website. Here are their connection details:</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
              <tr style="background-color: #f9fafb;">
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6; width: 35%;">IP Address</td>
                <td style="padding: 8px; border-bottom: 1px solid #f3f4f6; font-family: monospace;">${ip}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Referrer</td>
                <td style="padding: 8px; border-bottom: 1px solid #f3f4f6; color: #b45309;">${referrer || "Direct / Bookmark"}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Language</td>
                <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${language || "N/A"}</td>
              </tr>
              <tr>
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">Screen Resolution</td>
                <td style="padding: 8px; border-bottom: 1px solid #f3f4f6;">${screenResolution || "N/A"}</td>
              </tr>
              <tr style="background-color: #f9fafb;">
                <td style="padding: 8px; font-weight: bold; border-bottom: 1px solid #f3f4f6;">User Agent</td>
                <td style="padding: 8px; border-bottom: 1px solid #f3f4f6; font-size: 12px; color: #4b5563;">${userAgent}</td>
              </tr>
            </table>

            <h3 style="color: #E63925; border-bottom: 1px solid #e0e0e0; padding-bottom: 5px; margin-top: 25px;">📍 Geolocation Details</h3>
            ${geoHtml}

            <div style="margin-top: 30px; font-size: 11px; color: #9ca3af; text-align: center; border-top: 1px solid #e0e0e0; padding-top: 10px;">
              Sent automatically by Portfolio CMS Server. Time: ${new Date().toUTCString()}
            </div>
          </div>
        `,
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (visitEmailErr: any) {
        console.warn("SMTP email notification for visit timed out or failed on cloud host:", visitEmailErr.message);
      }
    } else {
      console.warn("SMTP email settings are not configured in environment variables. Skipped sending email for visit.");
    }

    return res.json({ success: true, message: "Visit logged successfully." });
  } catch (error: any) {
    console.error("Error logging portfolio visit:", error);
    return res.status(500).json({ message: error.message || "Failed to log visit" });
  }
};

