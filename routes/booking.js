const express = require("express");
const router = express.Router();
const { isLogedIn } = require("../middleware.js");
const bookingController = require("../controllers/bookingSection.js");

// Show booking form
router.get("/:id/book", isLogedIn, bookingController.renderBookingForm);

// Handle booking submission with validation
router.post("/:id/book", isLogedIn, bookingController.commitBooking);

module.exports = router;
