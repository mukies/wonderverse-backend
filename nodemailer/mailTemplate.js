exports.mailTemplate = (username, otp) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Verification Code</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      background-color: #f4f4f4;
      padding: 20px;
    "
  >
    <div
      style="
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      "
    >
      <h2 style="color: #333333">Verify Your Email Address</h2>
      <p style="color: #666666">Dear ${username},</p>
      <p style="color: #666666">
        Thank you for signing up! Please use the following verification code to
        complete your registration:
      </p>
      <div style="text-align: center; margin: 20px 0">
        <span
          style="
            display: inline-block;
            padding: 10px 20px;
            font-size: 24px;
            font-weight: bold;
            color: #ffffff;
            background-color: #4caf50;
            border-radius: 4px;
          "
          >${otp}</span
        >
      </div>
      <p style="color: #666666">
        This code is only valid for 1 hour, <br />
        If you did not request this code, please ignore this email.
      </p>
      <p style="color: #666666">Best regards,<br />Wanderverse Nepal Team</p>
    </div>
  </body>
</html>
`;
};

exports.bookingTemplateForUser = () => {};
exports.contactMessageTemplate = () => {};
exports.bookingTemplateForHotel = () => {};
exports.bookingTemplateForTransportation = () => {};
exports.bookingTemplateForGuide = () => {};
