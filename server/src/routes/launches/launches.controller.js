const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../model/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}
async function httpAddNewLaunch(req, res) {
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
  await addNewLaunch(newLaunch); // objects newLaunch are passed by reference,many changes made to that object inside the function will be reflected
  //because they share the same reference to the object
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
module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
