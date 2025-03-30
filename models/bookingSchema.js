const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    listing: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listing",
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    checkin: {
        type: Date,
        required: true,
    },
    checkout: {
        type: Date,
        required: true,
    },
    guests: {
        type: Number,
        required: true,
    },
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;
