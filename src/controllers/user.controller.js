import { APP_ENV } from "../constants.js";
import { User } from "../models/UserSchema.model.js";
import { sendMail } from "../services/mailService.js";
import { verificationMail } from "../templates/mail/verificationMail.js";
import ApiError from "../utils/ApiError.js";
import { TryCatch } from "../utils/TryCatch.js";

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
    return res.status(400).json(new ApiError(400, "Missing required fields"));
  }

  // Check if username is taken
  const user = await User.findOne({
    $or: [{ username }, { email }, { displayname }],
  });
  //   Check if username is taken
  if (user.username === username) {
    return res.status(400).json(new ApiError(400, "Username already taken"));
  }
  //   Check if email is taken
  if (user.email === email) {
    return res.status(400).json(new ApiError(400, "Email already taken"));
  }
  //   Check if display name is taken
  if (user.displayname === displayname) {
    return res
      .status(400)
      .json(new ApiError(400, "Display name already taken"));
  }
  // Create a new user
  const newUser = await User.create({ displayname, username, email, password });
  // send verification mail
  const mailVerificationToken = user.mailVerificationToken();
  await sendMail(
    user.email,
    "Email Verification",
    "",
    verificationMail(user.displayname, mailVerificationToken)
  );

  res.status(201).json(new ApiResponse(201, "User created", newUser));
});

// mail verification
const mailVerification = async (req, res) => {
  try {
    const { token } = req.params;

    if (!token) {
      return res.status(400).send("Invalid token");
    }

    // Decode the token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      return res.status(400).send("Invalid or expired token");
    }

    // Update the user's email verification status
    const user = await User.findByIdAndUpdate(
      { _id: decodedToken._id },
      { $set: { emailVerified: Date.now() } },
      { new: true }
    );

    if (!user) {
      return res.status(404).send("User not found");
    }

    return res.status(200).send("mail verified");
  } catch (error) {
    console.error("mailVerification Error:", error);
    return res.status(500).send("An internal server error occurred");
  }
};

const loginUser = TryCatch(async (req, res) => {
  // Code to login a user
  const { usernameOrEmail, password } = req.body;
  // Check if required fields are missing
  if ([usernameOrEmail, password].includes(undefined)) {
    return res.status(400).json(new ApiError(400, "Missing required fields"));
  }
  // Check if user exists
  const user = await User.findOne({
    $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
  });
  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }
  // Check if password is correct
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(401).json(new ApiError(401, "Invalid credentials"));
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
  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(200, "Login successful", {
        accessToken,
        refreshToken,
      })
    );
});

export { loginUser, mailVerification, registerUser };

