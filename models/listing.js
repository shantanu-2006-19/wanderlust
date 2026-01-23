const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review=require("./review.js");
const { required } = require("joi");
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: String,
    url: {
      type: String,
      default:
        "https://tse4.mm.bing.net/th/id/OIP.2XopVoNRAeRG8HEjNMqVswHaEK?pid=Api&P=0&h=180"
    },
  },
  price: {
    type: Number,
    min: 0,
  },
  location: String,
  country: String,
  reviews: [
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ],
  owner: {
    type:Schema.Types.ObjectId,
    ref: "User"
  },
  geometry: {
  type: {
    type: String,
    enum: ["Point"],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
}

});


listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({ _id: {$in :listing.reviews}})
  }
})

module.exports = mongoose.model("Listing", listingSchema);
