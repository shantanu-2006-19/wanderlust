if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const path = require("path")
const methodOverride = require("method-override");
const app = express();
const dbUrl=process.env.ATLASDB_URL;

const listingsRout = require("./routes/listing.js");
const reviewsRout = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const ExpressError = require("./utils/ExpressError");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const UserRout = require("./routes/user.js");
const multer = require("multer");
const { cloudinary, storage } = require("./cloudConfig.js");
const { error } = require("console");

const upload = multer({ storage });

async function main() {
  await mongoose.connect(dbUrl);
}
main()
  .then(() => console.log("Connected to DB"))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});



let sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  }
};

app.use(session(sessionOption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/", (req, res) => {
//   res.send("this is root");
// });

app.use("/listings", listingsRout);
app.use("/listings/:id/reviews", reviewsRout);
app.use("/", UserRout);

/* ✅ FIXED 404 HANDLER */
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found"));
});

/* ✅ FIXED ERROR HANDLER */
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went Wrong" } = err;
  console.log(err);
  res.status(statusCode).render("error.ejs", { err });
});

app.listen(8080, () => {
  console.log("Server running on port 8080");
});
