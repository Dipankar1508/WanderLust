const Listing = require("./models/listingSchema.js");
const Review = require("./models/reviewSchema.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");


module.exports.isLogedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {       // In-built function which will check whether the user is registed in the database or not
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Login First");
        res.redirect("/login")
    }
    next();
};

module.exports.savedRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}


module.exports.isOwner = async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing.owner.equals(req.user._id) && !req.user.isAdmin) {
        req.flash("error", "Access Denied !!");
        req.session.redirectUrl = null; // Clear the redirect URL
        return res.redirect(`/listing/${id}`);
    }
    next();
};

module.exports.ValidateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

module.exports.ValidateReview = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",")
        throw new ExpressError(400, errMsg);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async (req, res, next) => {
    let { id, reviewId } = req.params;
    let review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash("error", "Access Denied !!");
        req.session.redirectUrl = null; // Clear the redirect URL
        return res.redirect(`/listing/${id}`);
    }
    next();
};
module.exports.isAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        console.log("Access Denied: Not an Admin");
        req.flash("error", "Access Denied");
        return res.redirect("/");
    }
    // console.log("Access Granted: Admin Verified");
    next();
};
