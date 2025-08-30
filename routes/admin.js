const express = require("express");
const router = express.Router();
const { isLogedIn, isAdmin } = require("../middleware");
const adminController = require("../controllers/adminController");

// console.log("Admin Controller:", adminController); // Debugging

// Admin Dashboard Route
router.get("/dashboard", isLogedIn, isAdmin, (req, res, next) => {
    next();
}, adminController.getDashboard);



// Delete a Listing
router.delete("/listings/:id", isLogedIn, isAdmin, adminController.deleteListing);

// // Delete a Booking
router.delete("/bookings/:id", isLogedIn, isAdmin, adminController.deleteBooking);

// // Delete a User
router.delete("/users/:id", isLogedIn, isAdmin, adminController.deleteUser);

// // Edit a Listing (New Route)
router.put("/listings/:id", isLogedIn, isAdmin, adminController.editListing);

module.exports = router;
