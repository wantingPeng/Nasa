const { launches, addNewLaunch } = require("../../model/launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(Array.from(launches.values()));
}
function httpAddNewLaunch(req, res) {
  const newLaunch = req.body;

  if (
    !newLaunch.mission ||
    !newLaunch.rocket ||
    !newLaunch.launchDate ||
    !newLaunch.destination
  ) {
    return res.status(400).json({
      error: "missing required launch property",
    });
  }

  if (isNaN(newLaunch.launchDate)) {
    return res.status(400).json({
      error: "invalid launch date",
    });
  }

  newLaunch.launchDate = new Date(newLaunch.launchDate);
  addNewLaunch(newLaunch);
  return res.status(201).json(newLaunch); // if no .json(newLaunch);, in postman will got no response data returned
}
module.exports = { getAllLaunches, httpAddNewLaunch };
