// utils/sendEmail.js
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || "gmail", // או smtp אחר
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Teacher Tests" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html,
  });

  return info;
};
