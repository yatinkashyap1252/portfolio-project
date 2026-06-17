import { Request, Response, NextFunction } from "express";

/**
 * Recursively sanitizes input objects to prevent Mongo Query Injection
 * by removing any keys starting with '$' or containing '.'
 */
const sanitizeMongo = (obj: any): any => {
  if (obj instanceof Array) {
    for (let i = 0; i < obj.length; i++) {
      obj[i] = sanitizeMongo(obj[i]);
    }
  } else if (obj !== null && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      if (key.startsWith("$") || key.includes(".")) {
        delete obj[key];
      } else {
        obj[key] = sanitizeMongo(obj[key]);
      }
    });
  }
  return obj;
};

/**
 * Recursively sanitizes string inputs to prevent XSS script injections by escaping HTML tags.
 */
const sanitizeXSS = (obj: any): any => {
  if (typeof obj === "string") {
    return obj
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;");
  } else if (obj instanceof Array) {
    return obj.map((item) => sanitizeXSS(item));
  } else if (obj !== null && typeof obj === "object") {
    Object.keys(obj).forEach((key) => {
      obj[key] = sanitizeXSS(obj[key]);
    });
  }
  return obj;
};

export const mongoInjectionSelector = (req: Request, res: Response, next: NextFunction) => {
  if (req.body) req.body = sanitizeMongo(req.body);
  if (req.query) req.query = sanitizeMongo(req.query);
  if (req.params) req.params = sanitizeMongo(req.params);
  next();
};

export const xssSanitizer = (req: Request, res: Response, next: NextFunction) => {
  // We sanitize body, query, and params.
  // Note: For rich-text fields we might want to skip, but for standard metadata it's recommended.
  if (req.body) req.body = sanitizeXSS(req.body);
  if (req.query) req.query = sanitizeXSS(req.query);
  if (req.params) req.params = sanitizeXSS(req.params);
  next();
};
