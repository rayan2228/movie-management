import jwt from "jsonwebtoken";
import { APP_ENV, VERIFICATION_TOKEN_SIGNATURE } from "../constants.js";
import { Role } from "../models/roleSchema.model.js";
import { User } from "../models/UserSchema.model.js";
import { sendMail } from "../services/mailService.js";
import { verificationMail } from "../templates/mail/verificationMail.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { TryCatch } from "../utils/TryCatch.js";
import { passwordValidator } from "../utils/validator.js";
const generateAccessANDRefreshToken = async (user) => {
  const accessToken = user.accessTokenGenerate();
  const refreshToken = user.refreshTokenGenerate();
  user.refreshToken = refreshToken;
  await user.save();
  return { accessToken, refreshToken };
};

// Register a new user
const registerUser = TryCatch(async (req, res) => {
  // Code to create a user

  const { displayname, username, email, password } = req.body;
  // Check if required fields are missing
  if ([displayname, username, email, password].includes(undefined)) {
    throw new ApiError(400, "Missing required fields");
  }

  // Check if username is taken
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  //   Check if username is taken
  if (user?.username === username) {
    throw new ApiError(400, "Username already taken");
  }
  //   Check if email is taken
  if (user?.email === email) {
    throw new ApiError(400, "Email already taken");
  }

  // Check if password is valid
  if (!passwordValidator(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }

  // Create a new user
  const newUser = await User.create({ displayname, username, email, password });
  // send verification mail
  const mailVerificationToken = await newUser.mailVerificationToken();
  await sendMail(
    email,
    "Email Verification",
    "",
    verificationMail(displayname, mailVerificationToken)
  );
  const responseUser = { ...newUser._doc, password: undefined };
  res.status(201).json(new ApiResponse(201, "User created", responseUser));
});

// mail verification
const mailVerification = TryCatch(async (req, res) => {
  const { token } = req.params;

  if (!token) {
    throw new ApiError(400, "Token not provided");
  }

  // Decode the token
  let decodedToken;
  decodedToken = jwt.verify(token, VERIFICATION_TOKEN_SIGNATURE);
  if (!decodedToken) {
    throw new ApiError(400, "Invalid or expired token");
  }

  // Update the user's email verification status
  const user = await User.findByIdAndUpdate(
    { _id: decodedToken._id },
    { $set: { emailVerified: Date.now() } },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return res.status(200).json(new ApiResponse(200, "Email verified", user));
});

const loginUser = TryCatch(async (req, res) => {
  // Code to login a user
  const { usernameOrEmail, password } = req.body;
  // Check if required fields are missing
  if ([usernameOrEmail, password].includes(undefined)) {
    throw new ApiError(400, "Missing required fields");
  }
  // Check if user exists
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  // Check if password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
   throw new ApiError(401, "Invalid credentials");
  }
  // Generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessANDRefreshToken(
    user
  );
  // Send tokens as cookies
  const options = {
    secure: APP_ENV === "production" ? true : false,
    httpOnly: true,
    sameSite: "strict",
  };
  const responseUser = { ...user._doc, password: undefined };
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Login successful", {
        accessToken,
        refreshToken,
        responseUser,
      })
    );
});

const logoutUser = TryCatch(async (req, res) => {
  // Code to logout a user
  const user = req.user;
  user.refreshToken = "";
  await user.save();
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return res.status(200).json(new ApiResponse(200, "Logout successful"));
});

const createRoleBasedUser = TryCatch(async (req, res) => {
  // Code to create a role based user
  const { displayname, username, email, password, role } = req.body;
  // Check if required fields are missing
  if ([displayname, username, email, password, role].includes(undefined)) {
    throw new ApiError(400, "Missing required fields");
  }
  // Check if role exists
  const roleExists = await Role.find({ _id: { $in: role } });
  if (roleExists.length < 0) {
    throw new ApiError(404, "Role not found");
  }
  // Check if username is taken
  const user = await User.findOne({ $or: [{ username }, { email }] });
  if (user) {
    throw new ApiError(400, "Username already taken");
  }
  // Check if email is taken
  const emailExists = await User.findOne({ email });
  if (emailExists) {
    throw new ApiError(400, "Email already taken");
  }
  // Check if password is valid
  if (!passwordValidator(password)) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character."
    );
  }
  // Create a new user
  const newUser = await User.create({
    displayname,
    username,
    email,
    password,
    role,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, "role based user created", newUser));
});

export {
  createRoleBasedUser,
  loginUser,
  logoutUser,
  mailVerification,
  registerUser
};

