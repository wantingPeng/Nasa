const http = require("http");
const app = require("./app");
const { loadPlanetsData } = require("./model/planets.model");
const { error } = require("console");
const mongoose = require("mongoose");
const server = http.createServer(app);
//see app(express) as a middelware, separate middelware from server to organize better
const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://wanting:FgrQTCGeEY3nr3Tx@cluster0.qrmj6.mongodb.net/nasa?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connection.once("open", () => {
  console.log("mongoDB connection ready");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function startServer() {
  await mongoose.connect(MONGO_URL);
  ///load data befor server response to user
  await loadPlanetsData();
  server.listen(PORT, () => {
    //server.listen() starts the server and makes it listen for incoming connections on a specified port and optional hostname.
    //This is the step that "activates" the server,  tells the server to begin listening for incoming connections on the specified port
    console.log(`Server is running on port ${PORT}............`);
  });
}
startServer();
