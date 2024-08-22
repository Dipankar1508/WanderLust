const mongoose = require("mongoose");
const Listing = require("../models/listingSchema.js");
const initializeData = require("./index.js");

main()
  .then(() => {
    console.log("connection succesful");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wander");
}

const initDb = async () => {
  await Listing.deleteMany({}); //empty the collection
  initializeData.data = initializeData.data.map((obj) => ({
    ...obj,
    owner: "66bbabd5d42faf31717ffdec",
  }));
  await Listing.insertMany(initializeData.data);
  console.log("Reloaded");
};

initDb();
