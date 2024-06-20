const nodemailer = require("nodemailer");

exports.transporter = nodemailer.createTransport({
  host: "smtp.forwardemail.net",
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: process.env.NODE_MAILER_EMAIL_ID,
    pass: process.env.NODE_MAILER_AUTH_PASS,
  },
});
