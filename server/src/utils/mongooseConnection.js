const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://wanting:FgrQTCGeEY3nr3Tx@cluster0.qrmj6.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connection.once("open", () => {
  console.log("mongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}
async function mongoDisconnet() {
  await mongoose.disconnect();
}
module.exports = { mongoConnect, mongoDisconnet };
