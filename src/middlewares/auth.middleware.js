import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_SIGNATURE } from "../constants.js";
import { User } from "../models/UserSchema.model.js";
import ApiError from "../utils/ApiError.js";
import { TryCatch } from "../utils/TryCatch.js";
export const auth = TryCatch(async (req, res, next) => {
    const token = req.headers.authorization?.replace("Bearer ","") || req.cookies.accessToken;
    if (!token) {
        return res.status(401).json(new ApiError(401, "Unauthorized"));
    }
    const decoded = jwt.verify(token, ACCESS_TOKEN_SIGNATURE);
    if (!decoded) {
        return res.status(401).json(new ApiError(401, "Unauthorized"));
    }
    const user = await User.findById(decoded.id).populate("role");
    if (!user) {
        return res.status(401).json(new ApiError(401, "Unauthorized"));
    }
    req.user = user;
    next();
})