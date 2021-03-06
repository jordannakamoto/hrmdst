const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2').Strategy;

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

passport.use(new OAuth2Strategy({
    authorizationURL: 'https://api.typeform.com/oauth/authorize',
    tokenURL: 'https://api.typeform.com/oauth/token',
    clientID: 'EdvcmQHDyeUhasLMZbpEBe291eCXa26wXuQ57UaCxPzx',
    clientSecret: '99GVbThNm36RMbPwPBDnCKyLhX9m6BihNX4LoXoNxmwR',
    callbackURL: "https://hrmdst.azurewebsites.net/auth/callback",
	scope: ["responses:read"]
  },
  function(accessToken, refreshToken, profile, cb) {
      return cb(null, profile);
    }
));