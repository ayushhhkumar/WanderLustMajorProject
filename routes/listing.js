const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js"); 
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingContorller = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });


router.route("/")
    .get(wrapAsync(listingContorller.index))
    .post(
        isLoggedIn, 
        upload.single('listing[image]'),
        validateListing, 
        wrapAsync(listingContorller.createListing)
    );

// New Route
router.get("/new", isLoggedIn,listingContorller.renderNewForm);

router.route("/:id")

    .get(wrapAsync(listingContorller.showListing))

    .put(
        isLoggedIn, 
        isOwner,
        upload.single('listing[image]'), 
        validateListing, 
        wrapAsync(listingContorller.updateListing))

    .delete(
        isLoggedIn, 
        isOwner, 
        wrapAsync(listingContorller.destroyListing)
    );

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner,wrapAsync(listingContorller.renderEditForm));

module.exports = router;