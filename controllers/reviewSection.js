const Listing = require("../models/listingSchema.js")
const Review = require("../models/reviewSchema.js")


module.exports.commitReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);        //Accessing the id from req.params.id
    let newReview = new Review(req.body.review);                // creating the new Review from review object created at show.ejs
    newReview.author = req.user._id;
    console.log(newReview.author)
    listing.reviews.push(newReview);                            //pushing the mewReview tpo the listing.reviews

    await newReview.save();
    await listing.save();                                       // saving the exsiting data

    res.redirect(`/listing/${listing._id}`);
};

module.exports.destroyReview = async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });      //Deleting from the listing schema
    await Review.findByIdAndDelete(reviewId);                                   // Deleting from the review schema 
    res.redirect(`/listing/${id}`)
};