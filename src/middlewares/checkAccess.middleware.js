import ApiError from "../utils/ApiError.js";
import { TryCatch } from "../utils/TryCatch.js";

export const checkAccess = function (roles = [], permissions = []) {
  return TryCatch(async function (req, res, next) {
    const user = req.user;
    const userPermissions = user.role.permissions;
    const hasPermission = permissions.some((permission) =>
      userPermissions.includes(permission)
    );
    const hasRole = roles.some((role) => user.role.name === role);
    if (!hasPermission) {
      throw new ApiError(403, "Forbidden");
    }
    if (!hasRole) {
      throw new ApiError(403, "Forbidden");
    }
    next();
  });
};
