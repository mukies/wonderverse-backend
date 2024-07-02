const passport = require("passport");
const { Strategy } = require("passport-google-oauth20");
const userModel = require("../models/user.m");

passport.use(
  new Strategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND}/auth/google/redirect`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await userModel.findOne({
          $or: [{ email: profile.emails[0].value }, { googleID: profile.id }],
        });

        if (!user) {
          user = new userModel({
            googleID: profile.id,
            email: profile.emails[0].value,
            firstName: profile.name.givenName,
            lastName: profile.name.familyName,
            isVerified: true,
            photo: profile.photos[0].value,
          });

          await user.save();
        }

        return done(null, user._id.toString());
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // console.log("serialize", user);
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // console.log("deserialize", user);
  done(null, user);
});
