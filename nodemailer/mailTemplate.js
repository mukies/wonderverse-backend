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
exports.resetPasswordTemplate = (otp) => {
  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset OTP</title>
  </head>
  <body
    style="
      font-family: Arial, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f4;
    "
  >
    <table
      width="100%"
      cellpadding="0"
      cellspacing="0"
      style="
        max-width: 600px;
        margin: 0 auto;
        background-color: #ffffff;
        border-collapse: collapse;
      "
    >
      <tr>
        <td
          style="padding: 20px; text-align: center; background-color: #13a74c"
        >
          <h1 style="color: #ffffff; margin: 0">Wanderverse Nepal</h1>
        </td>
      </tr>
      <tr>
        <td style="padding: 20px">
          <h2 style="color: #333333">Password Reset code</h2>
          <p style="color: #666666">
            You have requested to reset your password. Please use the following
            code to complete the process:
          </p>
          <div
            style="
              background-color: #f0f0f0;
              padding: 10px;
              text-align: center;
              font-size: 24px;
              font-weight: bold;
              color: #119945;
              margin: 20px 0;
            "
          >
            ${otp}
          </div>
          <p style="color: #666666">
            This code is only valid for 5 minutes. If you didn't request a
            password reset, please ignore this email.
          </p>
          <p style="color: #666666">
            For security reasons, please do not share this code with anyone.
          </p>
        </td>
      </tr>
      <tr>
        <td
          style="
            padding: 20px;
            text-align: center;
            background-color: #f4f4f4;
            color: #888888;
          "
        >
          <p>&copy; 2024 Wanderverse Nepal. All rights reserved.</p>
          <p>If you have any questions, please contact our support team.</p>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
