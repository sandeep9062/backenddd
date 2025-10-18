import nodemailer from "nodemailer";

const sendEmail = async ({ to, subject, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.OWNER_EMAIL,
        pass: process.env.OWNER_EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Dental Tourism" <${process.env.OWNER_EMAIL}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

export default sendEmail;
