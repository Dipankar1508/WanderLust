if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listingSchema.js");
const { isLogedIn, isOwner, ValidateListing } = require("../middleware.js");
const listingControllers = require("../controllers/listingSection.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router // BETTER and Efficient way to do operation on same route
  .route("/")
  .get(listingControllers.index) //index route
  .post(
    upload.single("listing[image]"),
    ValidateListing,
    wrapAsync(listingControllers.commitNew)
  ); //commit new Listing

//index route
// router.get("/", listingControllers.index);

// Create New route
router.get("/new", isLogedIn, listingControllers.renderNewForm);

// Commit new listing
// router.post("/", ValidateListing, wrapAsync(listingControllers.commitNew));

// Details Route
router.get("/:id", wrapAsync(listingControllers.show));

// Edit Route
router.get(
  "/:id/edit",
  isLogedIn,
  isOwner,
  wrapAsync(listingControllers.renderEditForm)
);

// Commit edit route
router.put(
  "/:id",
  isLogedIn,
  isOwner,
  upload.single("listing[image]"),
  ValidateListing,
  wrapAsync(listingControllers.commitEdit)
);


// Delete Route
router.delete(
  "/:id",
  isLogedIn,
  isOwner,
  wrapAsync(listingControllers.destroyListing)
);

module.exports = router;
