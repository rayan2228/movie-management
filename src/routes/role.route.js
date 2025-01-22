import e from "express";
import { createRole, getRoles } from "../controllers/role.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { checkAccess } from "../middlewares/checkAccess.middleware.js";
const router = e.Router();

router
  .route("/roles")
  .post(auth, checkAccess(["admin"]), createRole)
  .get(auth, checkAccess(["admin"]), getRoles);

export default router;
