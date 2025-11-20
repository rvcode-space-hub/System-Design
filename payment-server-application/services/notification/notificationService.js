const nodemailer = require("nodemailer");
const logger = require("../../config/logger");

// Validate required environment variables
function validateEnv() {
  const required = ["EMAIL_HOST", "EMAIL_PORT", "EMAIL_USERNAME", "EMAIL_PASSWORD"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length) {
    throw new Error(`Missing Email ENV variables: ${missing.join(", ")}`);
  }
}

// Reusable transporter (better performance)
let transporter;

function getTransporter() {
  if (!transporter) {
    validateEnv();

    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: Number(process.env.EMAIL_PORT) === 465, // SSL for 465
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  return transporter;
}

async function sendEmail(to, subject, html) {
  try {
    logger.info(`Email Sending to ${to}...`);

    const mailOptions = {
      from: `"Notification Service" <${process.env.EMAIL_USERNAME}>`,
      to,
      subject,
      html,
      text: html.replace(/<[^>]+>/g, ""), // Fallback text-only version
    };

    const result = await getTransporter().sendMail(mailOptions);

    logger.info("Email Successfully Sent", { messageId: result.messageId });

    return { success: true, result };
  } catch (error) {
    logger.error("Email Sending Failed", {
      message: error.message,
      stack: error.stack,
    });

    return { success: false, error: error.message };
  }
}

async function notifyUserEmail({ email, subject, message }) {
  if (!email) return { success: false, error: "Email not provided" };

  return await sendEmail(email, subject || "Notification Alert", message);
}

module.exports = {
  sendEmail,
  notifyUserEmail,
};
