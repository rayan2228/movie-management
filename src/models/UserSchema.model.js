import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose, { model, Schema } from "mongoose";
import {
  ACCESS_TOKEN_EXPIRE,
  ACCESS_TOKEN_SIGNATURE,
  REFRESH_TOKEN_EXPIRE,
  REFRESH_TOKEN_SIGNATURE,
  VERIFICATION_TOKEN_EXPIRE,
  VERIFICATION_TOKEN_SIGNATURE,
} from "../constants.js";
import { emailValidator, passwordValidator } from "../utils/validator.js";

const UserSchema = new Schema(
  {
    displayname: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    username: {
      type: String,
      required: [true, "username is required"],
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      lowercase: true,
      trim: true,
      unique: true,
      validate: {
        validator: emailValidator,
        message: "invalid email address",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
      validate: {
        validator: passwordValidator,
        message:
          "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character.",
      },
    },
    avatar: {
      publicId: String,
      url: String,
    },
    role: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    ],
    emailVerified: Date,
    refreshToken: String,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  try {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    console.log("PASSWORD HASH ERROR", error);
    next(error);
  }
});

UserSchema.methods.isPasswordCorrect = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    console.log("PASSWORD CHECK ERROR", error);
  }
};

UserSchema.methods.mailVerificationToken = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
      },
      VERIFICATION_TOKEN_SIGNATURE,
      { expiresIn: VERIFICATION_TOKEN_EXPIRE }
    );
  } catch (error) {
    console.log("MAIL VERIFICATION TOKEN GENERATE ERROR", error);
  }
};

UserSchema.methods.accessTokenGenerate = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
      },
      ACCESS_TOKEN_SIGNATURE,
      { expiresIn: ACCESS_TOKEN_EXPIRE }
    );
  } catch (error) {
    console.log("ACCESS TOKEN GENERATE ERROR", error);
  }
};

UserSchema.methods.refreshTokenGenerate = function () {
  try {
    return jwt.sign(
      {
        _id: this._id,
        email: this.email,
        username: this.username,
        role: this.role,
      },
      REFRESH_TOKEN_SIGNATURE,
      { expiresIn: REFRESH_TOKEN_EXPIRE }
    );
  } catch (error) {
    console.log("REFRESH TOKEN GENERATE ERROR", error);
  }
};

export const User = mongoose.models.User || model("User", UserSchema);
