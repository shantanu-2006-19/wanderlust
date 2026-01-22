const Reviews = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.createReview = async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  const newReview = new Reviews(req.body.review);
  newReview.author = req.user._id;

  listing.reviews.push(newReview);

  await newReview.save();
  await listing.save();

  req.flash("success", "New review created successfully");
  res.redirect(`/listings/${listing._id}`);
};


module.exports.deleteReview = async (req, res) => {
  let { id, reviewsId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewsId } });
  await Reviews.findByIdAndDelete(reviewsId);

  req.flash("success", "Review deleted successfully");
  res.redirect(`/listings/${id}`);
};
