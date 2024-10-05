const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URL = process.env.MONGO_URL;
console.log("Connecting to MongoDB at:", MONGO_URL);
mongoose.connection.once("open", () => {
  console.log("mongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}
async function mongoDisconnet() {
  await mongoose.disconnect();
}
module.exports = { mongoConnect, mongoDisconnet };
