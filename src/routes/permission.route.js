import e from "express";
import {
    createPermission,
    getPermissions,
} from "../controllers/permission.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { checkAccess } from "../middlewares/checkAccess.middleware.js";
const router = e.Router();

router
  .route("/permissions")
  .get(auth, checkAccess(["admin"]), getPermissions)
  .post(auth, checkAccess(["admin"]), createPermission);

export default router;
