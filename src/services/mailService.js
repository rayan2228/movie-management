import nodemailer from "nodemailer";
import {
  EMAIL_HOST,
  EMAIL_PASSWORD,
  EMAIL_PORT,
  EMAIL_SECURE,
  EMAIL_SERVICE,
  EMAIL_USERNAME,
} from "../constants.js";

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  host: EMAIL_HOST,
  port: EMAIL_PORT,
  secure: EMAIL_SECURE,
  auth: {
    user: EMAIL_USERNAME,
    pass: EMAIL_PASSWORD,
  },
});

export async function sendMail(to, subject, text = "", html = "") {
  try {
    const info = await transporter.sendMail({
      from: "movie-management  <movie.management@gmail.com>",
      to,
      subject,
      text,
      html,
    });
  } catch (error) {
    throw new Error(`Error sending email ${error.message}`);
  }
}
