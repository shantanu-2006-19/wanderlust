const mongoose = require("mongoose");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");
const sampledata = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
  console.log("Connected to DB");

  await Listing.deleteMany({});

  // ✅ DB मधून एक user घे
  const user = await User.findOne();

  if (!user) {
    console.log("❌ No user found! Please signup first.");
    return;
  }

  sampledata.data = sampledata.data.map((obj) => ({
    ...obj,
    owner: user._id,  // ✅ correct existing user id
  }));

  await Listing.insertMany(sampledata.data);
  console.log("✅ Data was initialized with valid owner");

  mongoose.connection.close();
}

main().catch((err) => console.log(err));
