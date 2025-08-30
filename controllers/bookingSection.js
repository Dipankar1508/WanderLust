const Booking = require("../models/bookingSchema.js");
const Listing = require("../models/listingSchema.js");

// Show booking form
module.exports.renderBookingForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    res.render("allList/book.ejs", { listingId: id, listing });
};

// Handle booking submission
module.exports.commitBooking = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, checkin, checkout, guests } = req.body.booking;

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listing");
    }

    const newBooking = new Booking({
        listing: id,
        user: req.user._id,
        name,
        email,
        phone,
        checkin,
        checkout,
        guests,
    });

    await newBooking.save();
    req.flash("success", "Booking confirmed!");
    res.redirect(`/listing/${id}`);
};
