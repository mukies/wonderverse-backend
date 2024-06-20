exports.mailTemplate = (username, otp) => {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Code - ${otp}</title>
  </head>
  <body style="font-family: Verdana, Geneva, Tahoma, sans-serif">
    <div style="padding-inline: 5px">
      <p style="font-size: 20px">Hello ${username},</p>
      <p>
        Thank you for registering. Please use the following verification code to
        complete your registration:
      </p>
      <div>
        <p style="margin: 0px; padding: 0px">Varification Code:</p>
        <p
          style="
            font-weight: bold;
            font-size: 28px;
            margin-block: 3px;
            padding: 0px;
          "
        >
          ${otp}
        </p>
        <p style="font-size: 15px; margin-top: 0px; margin-bottom: 10px">
          (This code is valid only for 1 hour.)
        </p>
      </div>

      <p>If you did not request this code, please ignore this email.</p>

      <div>
        <p style="margin-bottom: 3px; font-size: 18px">Thank You !</p>
        <p style="margin-top: 3px; font-weight: 600">Wonderverse Nepal Team</p>
      </div>

      <div
        style="
          height: 150px;
          width: 150px;
          overflow: hidden;
          border-radius: 100%;
        "
      >
        <img
          style="
            object-fit: cover;
            object-position: center;
            height: 100%;
            width: 100%;
          "
          src="https://res.cloudinary.com/dslt6nblj/image/upload/v1718525434/assets/vixw6al2fl3dbea8k1ap.jpg"
          alt="Wonderverse Nepal"
        />
      </div>
    </div>
  </body>
</html>
`;
};
