const { lauches } = require("../../model/launches.model");

function getAllLaunches(req, res) {
  console.log(lauches.values());
  return res.status(200).json(Array.from(lauches.values()));
}
