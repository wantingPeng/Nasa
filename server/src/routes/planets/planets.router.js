const express = require("express");
const { getAllPlanets } = require("./planets.controller");
const planetsRouter = express.Router();
//group all planets related routes in this file,Helps splitting routes into smaller, logical modules that can be managed separately.
planetsRouter.get("/planets", getAllPlanets);
module.exports = planetsRouter;
