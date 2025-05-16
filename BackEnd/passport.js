

const passport = require("passport");
require("dotenv").config();
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;
const authModel = require("./Models/Model");
const bcrypt = require("bcrypt");

const localStrategyCallback = async (email, password, done) => {
  try {
    const user = await authModel.findOne({ email: email });
    if (!user) {
      return done(null, false, { message: "Incorrect email" });
    }
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      return done(null, user);
    } else {
      return done(null, false, { message: "Incorrect password" });
    }
  } catch (err) {
    return done(err);
  }
};


passport.use(
  new LocalStrategy({ usernameField: "email" }, localStrategyCallback)
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId, done) => {
  try {
    const user = await authModel.findById(userId);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;