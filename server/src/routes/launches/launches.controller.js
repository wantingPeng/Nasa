const {
  launches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../model/launches.model");

function getAllLaunches(req, res) {
  return res.status(200).json(Array.from(launches.values()));
}
function httpAddNewLaunch(req, res) {
  const newLaunch = req.body;

  if (
    !newLaunch.mission ||
    !newLaunch.rocket ||
    !newLaunch.launchDate ||
    !newLaunch.target
  ) {
    return res.status(400).json({
      error: "missing required launch property",
    });
  }
  newLaunch.launchDate = new Date(newLaunch.launchDate);

  if (isNaN(newLaunch.launchDate)) {
    return res.status(400).json({
      error: "invalid launch date",
    });
  }
  addNewLaunch(newLaunch);
  return res.status(201).json(newLaunch); // if no .json(newLaunch);, in postman will got no response data returned
}

function httpAbortLaunch(req, res) {
  launchId = Number(req.params.id);

  if (!existsLaunchWithId(launchId)) {
    return res.status(404).json({ error: "lunch not found" });
  }
  const abortedLaunch = abortLaunchById(launchId);
  {
    return res.status(200).json(abortedLaunch);
  }
}
module.exports = { getAllLaunches, httpAddNewLaunch, httpAbortLaunch };
