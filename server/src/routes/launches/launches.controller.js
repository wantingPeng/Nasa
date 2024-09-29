const { launches, addNewLaunch } = require("../../model/launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(Array.from(launches.values()));
}
function httpAddNewLaunch(req, res) {
  const newLaunch = req.body;
  newLaunch.launchDate = new Date(launches.launchDate);
  addNewLaunch(newLaunch);
  return res.status(201).json(newLaunch);
}
module.exports = { getAllLaunches, httpAddNewLaunch };
