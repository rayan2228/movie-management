import e from "express";
import {
  createReport,
  getReports,
  updateReport,
} from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { checkAccess } from "../middlewares/checkAccess.middleware.js";
const router = e.Router();
router
  .route("/reports")
  .get(auth, checkAccess(["admin"]), getReports)
  .put(auth, checkAccess(["admin"]), updateReport)
  .post(auth, createReport);
export default router;
