import e from "express";
import {
  createReport,
  getReports,
  updateReport,
} from "../controllers/report.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { checkAccess } from "../middlewares/checkAccess.middleware.js";
const router = e.Router();
router.route("/reports").get(auth, checkAccess(["admin"]), getReports);
router
  .route("/reports/movies/:id")
  .post(auth, createReport)
  .put(auth, checkAccess(["admin"]), updateReport);
export default router;
