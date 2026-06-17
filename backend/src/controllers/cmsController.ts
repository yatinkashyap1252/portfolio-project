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
