const express = require("express");
const Listing = require("../models/listing.js");
const path = require("path");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("../schema.js")
const router = express.Router();
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const listingControllers = require("../controllers/listing.js")
const multer = require("multer");
const { cloudinary, storage } = require("../cloudConfig.js");
const upload = multer({ storage });



router
    .route("/")
    .get(wrapAsync(listingControllers.index))
    .post(
        isLoggedIn,
        validateListings,
        upload.single("listing[image][url]"),
        wrapAsync(listingControllers.createNewListing)
    );


//new Route
router.get("/new", isLoggedIn, listingControllers.rendernewForm);

router
    .route("/:id")
    .get(wrapAsync(listingControllers.showListing))
    .put(
        isLoggedIn,
        upload.single("listing[image][url]"),
        validateListings,
        isOwner,
        wrapAsync(listingControllers.updateListing)
    )
    .delete(
        isLoggedIn,
        isOwner,
        wrapAsync(listingControllers.deletelisting));





// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm));



module.exports = router;