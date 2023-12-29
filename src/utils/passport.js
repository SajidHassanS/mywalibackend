const passport = require("passport");
const mongoose = require("mongoose");
const { Strategy: LocalStrategy } = require("passport-local");
const User = mongoose.model("User");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    const User = mongoose.model(`User`);

    User.findOne({ email: email.trim().toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }

      user.comparePassword(password, async (err, isMatch) => {
        if (err) {
          console.log(err);
          return done(err);
        }
        if (isMatch) {
          let token = await user.generateAuthToken();
          user.token = token;
          return done(null, user);
        }
        return done(null, false, { msg: "Invalid email or password." });
      });
    });
  })
);
