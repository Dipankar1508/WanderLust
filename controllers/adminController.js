const User = require("../models/userSchema.js");
const Listing = require("../models/listingSchema.js");
const Booking = require("../models/bookingSchema.js");

const getDashboard = async (req, res) => {
    try {
        // console.log("Admin Dashboard Route Hit");
        const users = await User.find({});
        const bookings = await Booking.find({}).populate("listing").populate("user");
        const listings = await Listing.find({}).populate("owner", "username email");


        // Filter out bookings with missing listings
        const validBookings = bookings.filter(booking => booking.listing !== null);

        res.render("admin/adminDashboard", { users, listings, bookings: validBookings });

    } catch (err) {
        console.error("Error fetching admin data:", err);
        req.flash("error", "Error fetching admin data.");
        res.redirect("/");
    }
};


const deleteBooking = async (req, res) => {
    try {
        await Booking.findByIdAndDelete(req.params.id);
        req.flash("success", "Booking deleted successfully.");
        res.redirect("/admin/dashboard");
    } catch (err) {
        req.flash("error", "Error deleting booking.");
        res.redirect("/admin/dashboard");
    }
};

const deleteListing = async (req, res) => {
    try {
        await Listing.findByIdAndDelete(req.params.id);
        req.flash("success", "Listing deleted successfully.");
        res.redirect("/admin/dashboard");
    } catch (err) {
        req.flash("error", "Error deleting listing.");
        res.redirect("/admin/dashboard");
    }
};

const deleteUser = async (req, res) => {
    try {
        console.log("Deleting user:", req.params.id);
        await User.findByIdAndDelete(req.params.id);
        req.flash("success", "User deleted successfully.");
        res.redirect("/admin/dashboard");
    } catch (err) {
        console.log("Error deleting user:", err);
        req.flash("error", "Error deleting user.");
        res.redirect("/admin/dashboard");
    }
};

const editListing = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body; // Ensure this matches your form fields
        await Listing.findByIdAndUpdate(id, updatedData);
        req.flash("success", "Listing updated successfully.");
        res.redirect("/admin/dashboard");
    } catch (err) {
        req.flash("error", "Error updating listing.");
        res.redirect("/admin/dashboard");
    }
};

module.exports = {
    getDashboard,
    deleteBooking,
    deleteListing,
    deleteUser,
    editListing,
};
