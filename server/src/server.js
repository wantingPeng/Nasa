const http = require("http");
const app = require("./app");

const server = http.createServer(app);
//see app(express) as a middelware, separate middelware from server to organize better
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Listing on port ${PORT}............`);
});
