const express = require("express");
const { httpGetAllPlanets } = require("./planets.controller");
const planetsRouter = express.Router();
//group all planets related routes in this file,Helps splitting routes into smaller, logical modules that can be managed separately.
planetsRouter.get("/", httpGetAllPlanets);
module.exports = planetsRouter;
