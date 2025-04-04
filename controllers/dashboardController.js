const Booking = require("../models/bookingSchema.js");
const Listing = require("../models/listingSchema.js");

module.exports.renderDashboard = async (req, res) => {
    try {
        // Fetch user bookings
        const userBookings = await Booking.find({ user: req.user._id }).populate("listing");

        // Fetch user listings (if they own any)
        const userListings = await Listing.find({ owner: req.user._id });

        res.render("allList/dashboard.ejs", { userBookings, userListings });
    } catch (err) {
        req.flash("error", "Error loading dashboard");
        res.redirect("/listing");
    }
};
module.exports.deleteBooking = async (req, res) => {
    const { id } = req.params;

    await Booking.findByIdAndDelete(id);
    req.flash("success", "Booking successfully canceled!");
    res.redirect("/dashboard");
};