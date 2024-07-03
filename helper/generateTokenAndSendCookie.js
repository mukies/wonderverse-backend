const jwt = require("jsonwebtoken");
exports.generateTokenAndSetCookie = async (userID, res) => {
  const token = jwt.sign({ userID }, process.env.JWT_KEY);

  res.cookie("jwt", token, {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: false,
  });
};
