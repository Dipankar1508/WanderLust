const express = require("express");
const router = express.Router();
const dashboardController = require("../controllers/dashboardController.js");
const { isLogedIn } = require("../middleware.js");
const methodOverride = require("method-override");

router.use(methodOverride("_method"));

// SHOW DASHBOARD
router.get("/", isLogedIn, dashboardController.renderDashboard);

// DELETE BOOKING
router.delete("/bookings/:id", isLogedIn, dashboardController.deleteBooking);

module.exports = router;
