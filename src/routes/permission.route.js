import e from "express";
import {
    createPermission,
    getPermissions,
} from "../controllers/permission.controller.js";
const router = e.Router();

router.route("/permissions").get(getPermissions).post(createPermission);

export default router;
