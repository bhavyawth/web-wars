import jwt from 'jsonwebtoken';
import crypto from "crypto";
import nodemailer from "nodemailer";

export const generateToken = (id, type, res) => {
  const token = jwt.sign({ id, type }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  return token;
};


export function createVerificationToken() {
  const token = crypto.randomBytes(32).toString("hex"); // send this in email
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex"); // store hashed
  const expires = Date.now() + 60 * 60 * 1000; // 1 hour expiry
  return { token, hashedToken, expires };
}

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // e.g. smtp.sendgrid.net, smtp.gmail.com
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, plainToken) {
  const verifyUrl = `${process.env.FRONTEND_URL}/sellermarket/verify?token=${plainToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; color: #333;">
      <h2 style="color: #4CAF50;">Your Seller Verification Awaits! 🎉</h2>
      <p>Hi there 👋,</p>
      <p>We noticed you want to add a <strong>verified badge</strong> to your seller profile. This helps buyers trust you more!</p>
      <p>Click the button below to verify your account:</p>
      <div style="margin: 20px 0;">
        <a href="${verifyUrl}" 
            style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Add Verified Badge ✅
        </a>
      </div>
      <p>If the button doesn’t work, copy and paste this link into your browser:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p style="color: #777; font-size: 12px;">This link will expire in 1 hour. If you didn’t request verification, just ignore this email.</p>
      <hr>
      <p style="font-size: 12px; color: #aaa;">Marketplace Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "Get Your Verified Badge on Marketplace!",
    html,
  });
}
