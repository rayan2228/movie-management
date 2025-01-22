import e from "express";
import {
    createRoleBasedUser,
    loginUser,
    mailVerification,
    registerUser,
} from "../controllers/user.controller.js";
const router = e.Router();

router.route("/users/register").post(registerUser);
router.route("/users/login").post(loginUser);
router.route("/users/verify-email/:token").get(mailVerification);
router.route("/users/role-based-user-registration").post(createRoleBasedUser);

export default router;