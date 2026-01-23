const { models } = require("mongoose");
const Listing = require("../models/listing.js");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken=process.env.MAP_BOX_LOCAL_TOKEN;
const geocodingClient=mbxGeocoding({accessToken :mapToken});

module.exports.index = async (req, res) => {
    const lists = await Listing.find({});
    res.render("listings/index.ejs", { lists });
};

module.exports.rendernewForm = (req, res) => {
    res.render("listings/new.ejs");
}


module.exports.showListing = async (req, res) => {
    const { id } = req.params;

    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner");

    if (!listing) {
        req.flash("error", "Listing you requested does not exist");
        return res.redirect("/listings");
    }


    res.render("listings/show.ejs", { listing });
}


module.exports.createNewListing = async (req, res) => {
    
    let response=await geocodingClient
        .forwardGeocode({
            query :req.body.listing.location
        })
        .send();
        
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename };
    newListing.geometry=response.body.features[0].geometry;
    await newListing.save();
    req.flash("success", "new Listing Created");
    res.redirect("/listings");
}


module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }
    let OriginalImageUrl=listing.image.url;
    OriginalImageUrl = OriginalImageUrl.replace("/upload","/upload/h_100")

    res.render("listings/edit.ejs", { listing ,OriginalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        {
            new: true,
            runValidators: true
        }
    );
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename,
        };
        await listing.save();
    }

    req.flash("success", "Listing Updated! ");
    res.redirect(`/listings/${id}`);
};

module.exports.deletelisting = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}