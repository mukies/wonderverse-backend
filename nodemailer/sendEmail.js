const { mailTemplate } = require("./mailTemplate");
const { transporter } = require("./transporter");

exports.sendEmail = async (username, otp, email) => {
  let mailOptions = {
    from: "'Wanderverse' <process.env.NODE_MAILER_EMAIL_ID>",
    to: email,
    subject: `Your Code - ${otp}`,
    html: mailTemplate(username, otp),
  };

  transporter.sendMail(mailOptions, (err, data) => {
    console.log("error -->", err);
    console.log("data -->", data);
  });
};
