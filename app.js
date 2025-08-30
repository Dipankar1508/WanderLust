const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const method_override = require("method-override");
const ExpressError = require("./utils/ExpressError.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/userSchema.js");
require("dotenv").config();

const listingRoutes = require("./routes/listing.js");
const reviewRoutes = require("./routes/review.js");
const userRoutes = require("./routes/user.js");
const bookRoutes = require("./routes/booking.js");
const dashboardRoutes = require("./routes/dashboard.js");
const adminRoutes = require("./routes/admin.js");
const { constants } = require("buffer");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(method_override("_method"));

const DB_URL = process.env.ATLAS_URL;
const MONGO_URL = 'mongodb://127.0.0.1:27017/wander';

// Switch between Atlas and Local DB
let useLocal = false;
const dbToUse = useLocal ? MONGO_URL : DB_URL;


main()
  .then(() => {
    console.log("connection succesful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbToUse);
}

const store = MongoStore.create({
  mongoUrl: dbToUse,
  crypto: {
    secret: process.env.SESSION_SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("Error in Database", err);
});


const sessionOptions = {
  store,
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};


// app.get("/", (req, res) => {
//     res.send("Good To Go");
// })

app.use(session(sessionOptions)); //Using Sessions
app.use(flash()); //Using Flash

app.use(passport.initialize()); // Passport
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/listing");
});

// Listing Route
app.use("/listing", listingRoutes);

// Review
app.use("/listing/:id/reviews", reviewRoutes);

//User Route
app.use("/", userRoutes);

// Book Route
app.use("/listing", bookRoutes);

//Dashboard Route
app.use("/dashboard", dashboardRoutes);

//Admin Route
app.use("/admin", adminRoutes);

// app.use("/admin", adminRoutes);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Search Page was Not Found"));
});

app.use((err, req, res, next) => {
  let { statusCode = 502, message = "Got Some Error" } = err;
  // res.status(statusCode).send(message)
  res.render("allList/error.ejs", { message });
});
app.listen(8080, () => {
  console.log("SERVER ACTIVATED");
});
