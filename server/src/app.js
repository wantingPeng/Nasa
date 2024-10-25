const express = require("express");
const api = require("./routes/api");
const cors = require("cors");
const app = express();
const path = require("path");
const morgan = require("morgan");
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);
app.use(morgan("combined")); //Logs details about each HTTP request (e.g., method, URL, status code, response time).

app.use(express.json());
app.use("/v1", api);
app.use(express.static(path.join(__dirname, "..", "public")));
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
