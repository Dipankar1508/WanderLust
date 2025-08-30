const User = require("../models/userSchema.js");

module.exports.renderSignUp = (req, res) => {
    res.render("user/signup.ejs")
}
module.exports.signup = async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUSer = new User({ username, email });
        let RegisterUser = await User.register(newUSer, password);
        console.log(RegisterUser);
        req.login(RegisterUser, (err) => {
            if (err) {
                return next(err);
            }
            req.flash("success", "Successfully Registered")
            return res.redirect("/listing");
        })
    } catch (err) {
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.renderLogin = (req, res) => {
    res.render("user/login.ejs")
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back To WanderLust");
    let redirect = res.locals.redirectUrl || "/listing";
    return res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash("success", "You Are Now Logged Out");
        res.redirect("/listing");
    })
};