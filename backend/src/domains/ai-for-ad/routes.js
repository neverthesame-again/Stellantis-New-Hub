import express from "express";
import productOwnerRouter from "./product-owner/routes.js";

const router = express.Router();

/**
 * AI for AD (Automated Development / Autonomous Driving) Domain Router
 * Multi-Role Backend Architecture:
 * - Product Owner (Active) -> ./product-owner/routes.js
 * - Future roles: Lead Architect, Safety Engineer, Software Engineer
 */

/**
 * GET /api/ad/status
 * Health check endpoint for AD domain
 */
router.get("/status", (req, res) => {
  res.json({
    domain: "AI for AD",
    message: "AI for AD domain router active",
    activeRoles: ["product-owner"],
    status: "healthy"
  });
});

// Mount Product Owner role routes at root of /api/ad (for backward compatibility)
router.use("/", productOwnerRouter);

// Also mount explicitly at /api/ad/product-owner
router.use("/product-owner", productOwnerRouter);

export default router;
