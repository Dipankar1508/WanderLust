const express = require("express");
const router = express.Router();
const User = require("../models/userSchema.js");
const passport = require("passport");
const { savedRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/userSectioin.js");

router.get("/signup", userController.renderSignUp);

router.post("/signup", userController.signup);

router.get("/login", userController.renderLogin);

router.post("/login", savedRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login);

router.get("/logout", userController.logout);

module.exports = router;