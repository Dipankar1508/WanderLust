const Listing = require("../models/listingSchema.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken = process.env.MAP_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
  let { search, title } = req.query;
  let filter = {};

  // Search functionality (title or location)
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
    ];
  }

  // Filter by title (Clicking a filter option)
  if (title) {
    filter.title = { $regex: title, $options: "i" };
  }

  let listing = await Listing.find(filter);
  res.render("allList/Landscape.ejs", { listing });
};

module.exports.renderNewForm = (req, res) => {
  res.render("allList/new.ejs");
};

module.exports.commitNew = async (req, res, next) => {
  let response = await geocodingClient
    .forwardGeocode({
      query: req.body.listing.location,
      limit: 1,
    })
    .send();

  let url = req.file.path;
  let filename = req.file.filename;
  let newlisting = new Listing(req.body.listing);
  // console.log(req.user);
  newlisting.owner = req.user._id;
  newlisting.image = { url, filename };

  newlisting.geometry = response.body.features[0].geometry; //Accessing the "  response.body.features[0].geometry  " of the geocoding mehtod.And there is the actual coordiante of the of the location
  let resu = await newlisting.save();
  console.log(resu);
  req.flash("success", "New Listing Created !!");
  res.redirect("/listing");
};

module.exports.show = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", "Listing Does Not Exist !!");
    res.redirect("/listing");
  }
  res.render("allList/show.ejs", { listing });
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  // console.log(listing);
  if (!listing) {
    req.flash("error", "Listing Does Not Exist !!");
    res.redirect("/listing");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
  res.render("allList/edit.ejs", { listing, originalImageUrl });
};

module.exports.commitEdit = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  if (typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
  }
  req.flash("success", "Listing Updated !!");
  res.redirect(`/listing/${id}`);
};

module.exports.bookHotel = async (req, res) => {
  let listing = await Listing.find();
  res.render("allList/book.ejs", { listing });
};


module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing Deleted !!");
  res.redirect("/listing");
};
