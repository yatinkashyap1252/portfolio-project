import { Router } from "express";
import {
  getDashboardSummary,
  getActivityLogs,
  // Hero
  getHero,
  updateHero,
  // About
  getAbout,
  updateAbout,
  // Skills
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  bulkCreateSkills,
  // Projects
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  duplicateProject,
  // Experience
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  // Education
  getEducations,
  createEducation,
  updateEducation,
  deleteEducation,
  // Certificates
  getCertificates,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  // Contact
  getContact,
  updateContact,
  // SEO
  getSEO,
  updateSEO,
} from "../controllers/cmsController";
import { requireAuth } from "../middleware/auth";

const router = Router();

// Dashboard aggregates API
router.get("/dashboard", requireAuth, getDashboardSummary);
router.get("/logs", requireAuth, getActivityLogs);

// Hero CRUD
router.get("/hero", getHero); // Public fetch available
router.put("/hero", requireAuth, updateHero);

// About CRUD
router.get("/about", getAbout); // Public fetch available
router.put("/about", requireAuth, updateAbout);

// Skills CRUD
router.get("/skills", getSkills); // Public fetch available
router.post("/skills", requireAuth, createSkill);
router.post("/skills/bulk", requireAuth, bulkCreateSkills);
router.put("/skills/:id", requireAuth, updateSkill);
router.delete("/skills/:id", requireAuth, deleteSkill);

// Projects CRUD
router.get("/projects", getProjects); // Public fetch available
router.get("/projects/:id", getProjectById);
router.post("/projects", requireAuth, createProject);
router.post("/projects/:id/duplicate", requireAuth, duplicateProject);
router.put("/projects/:id", requireAuth, updateProject);
router.delete("/projects/:id", requireAuth, deleteProject);

// Experience CRUD
router.get("/experience", getExperiences); // Public fetch available
router.post("/experience", requireAuth, createExperience);
router.put("/experience/:id", requireAuth, updateExperience);
router.delete("/experience/:id", requireAuth, deleteExperience);

// Education CRUD
router.get("/education", getEducations); // Public fetch available
router.post("/education", requireAuth, createEducation);
router.put("/education/:id", requireAuth, updateEducation);
router.delete("/education/:id", requireAuth, deleteEducation);

// Certificates CRUD
router.get("/certificates", getCertificates); // Public fetch available
router.post("/certificates", requireAuth, createCertificate);
router.put("/certificates/:id", requireAuth, updateCertificate);
router.delete("/certificates/:id", requireAuth, deleteCertificate);

// Contact CRUD
router.get("/contact", getContact); // Public fetch available
router.put("/contact", requireAuth, updateContact);

// SEO CRUD
router.get("/seo", getSEO); // Public fetch available
router.put("/seo", requireAuth, updateSEO);

export default router;
