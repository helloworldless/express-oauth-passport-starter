const bodyParser = require("body-parser");
const config = require("./config");
const express = require("express");
const http = require("http");
const session = require("express-session");
const sessionFileStore = require("session-file-store");
const app = express();
const fileStore = sessionFileStore(session);
const server = http.Server(app);
const passport = require("passport");
const auth = require("./auth");

app.set("view engine", "ejs");

auth(passport);

const sessionMiddleware = session({
  resave: true,
  saveUninitialized: true,
  store: new fileStore({}),
  secret: "oauth example"
});

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.name = "-";
  if (req.user && req.user.profile && req.user.profile.name) {
    res.locals.name =
      req.user.profile.name.givenName || req.user.profile.displayName;
  }

  res.locals.avatarUrl = "";
  if (req.user && req.user.profile && req.user.profile.photos) {
    res.locals.avatarUrl = req.user.profile.photos[0].value;
  }
  next();
});

app.get("/", (req, res) => {
  if (!req.user || !req.isAuthenticated()) {
    res.render("login", {
      loginUrl: `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&scope=profile&client_id=${config.oAuthClientID}&redirect_uri=${config.oAuthCallbackUrl}&state=test_not_for_prod`
    });
  } else {
    res.render("home", { user: req.user });
  }
});

app.get("/logout", (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
});

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: config.scopes,
    failureFlash: true,
    session: true
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    failureFlash: true,
    session: true
  }),
  (req, res) => {
    res.redirect("/");
  }
);

server.listen(config.port, () => {
  console.log(`Server started on port ${config.port}`);
});

function renderIfAuthenticated(req, res, page) {
  if (!req.user || !req.isAuthenticated()) {
    res.redirect("/");
  } else {
    res.render(page);
  }
}
