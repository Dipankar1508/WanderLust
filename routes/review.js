const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/reviewSchema.js");
const Listing = require("../models/listingSchema.js");
const { ValidateReview, isLogedIn, isAuthor } = require("../middleware.js")
const reviewController = require("../controllers/reviewSection.js");


// Post route
router.post("/", isLogedIn, ValidateReview, wrapAsync(reviewController.commitReview));

router.delete("/:reviewId", isLogedIn, isAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;