import e from "express";
import { createRole, getRoles } from "../controllers/role.controller.js";
const router = e.Router();

router.route("/roles").post(createRole).get(getRoles);

export default router;