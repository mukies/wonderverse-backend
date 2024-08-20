const jwt = require("jsonwebtoken");
exports.generateTokenAndSetCookie = async (userID, res, title) => {
  const token = jwt.sign({ userID }, process.env.JWT_KEY);

  res.cookie(title, token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "none",
    secure: false,
  });
};
