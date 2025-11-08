import nodemailer from "nodemailer";
// SMTP_HOST=smtp.ethereal.email
// SMTP_PORT=587
// SMTP_SECURE=false
// SMTP_USER=justine.champlin@ethereal.email
// SMTP_PASS=fEA9f7ekaSn3hV77gG
// 4DD9V627SUE1AMW9KWXB5J21
// SMTP_HOST=smtp.sendgrid.net
// SMTP_PORT=587
// SMTP_USER=apikey
// SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
// SMTP_FROM=no-reply@syncspace.com

export const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: "ignacio.veum@ethereal.email",
        pass: "PgCMEma3s4xC4CPkfQ",
      },
    });

    // Send mail
    await transporter.sendMail({
      from: `SyncSpace <${process.env.SMTP_USER}>`,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });

    // console.log(`Email sent to ${options.to}`);
  } catch (err) {
    // console.error("Error sending email:", err);
    throw new Error("Email could not be sent");
  }
};
