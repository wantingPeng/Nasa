const http = require("http");
require("dotenv").config();
const app = require("./app");
const { mongoConnect } = require("./utils/mongooseConnection");
const { loadPlanetsData } = require("./model/planets.model");
const { loadSpaceXData } = require("./model/launches.model");

const { error } = require("console");
const server = http.createServer(app);
//see app(express) as a middelware, separate middelware from server to organize better
const PORT = process.env.PORT || 8000;

async function startServer() {
  await mongoConnect();
  ///load data befor server response to user
  await loadPlanetsData();
  await loadSpaceXData();
  server.listen(PORT, () => {
    //server.listen() starts the server and makes it listen for incoming connections on a specified port and optional hostname.
    //This is the step that "activates" the server,  tells the server to begin listening for incoming connections on the specified port
    console.log(`Server is running on port ${PORT}............`);
  });
}
startServer();
