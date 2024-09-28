const http = require("http");
const app = require("./app");
const planetsRouter = require("./routes/planets/planets.router");
const express = require("express");

const server = http.createServer(app);
//see app(express) as a middelware, separate middelware from server to organize better
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(planetsRouter);

server.listen(PORT, () => {
  console.log(`Listing on port ${PORT}............`);
});
