import express from "express";
import { getDashboard, getAllLoans } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/auth.js";
import adminMiddleware from "../middleware/adminMiddleWare.js";

const router = express.Router();

// Admin dashboard stats
router.get("/admin/dashboard", authMiddleware, adminMiddleware, getDashboard);

// Admin get all loans (for loan management page)
router.get("/admin/loans", authMiddleware, adminMiddleware, getAllLoans);

export default router;
