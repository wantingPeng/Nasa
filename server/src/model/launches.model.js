const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
let firstFlightNumber = 100;
const launch = {
  flightNumber: 100,
  mission: "keplor exploration X",
  rocket: "explore 1",
  launchDate: new Date("december 27,2023"),
  target: "Kepler-1652 b",
  customer: ["Nasa", "cici"],
  upcoming: true,
  sucess: true,
};

async function addNewLaunch(launch) {
  const latestFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    flightNumber: latestFlightNumber,
    customer: ["Nasa", "cici"],
    upcoming: true,
    sucess: true,
  });
  await saveLaunch(newLaunch);
}

async function getLatestFlightNumber() {
  const latestlaunch = await launches.findOne().sort("-flightNumber"); //sort the results by flightNumber in descending order
  if (!latestlaunch) {
    return firstFlightNumber;
  }
  return latestlaunch.flightNumber;
}

//launches.set(launch.flightNumber, launch);
async function saveLaunch(launch) {
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("no matching planet found");
  }
  await launches.findOneAndUpdate(
    //updateOne
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true }
  );
}
saveLaunch(launch);

async function getAllLaunches() {
  return await launches.find({}, { __v: 0, _id: 0 });
}

function existsLaunchWithId(launchId) {
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  const abortedLaunch = launches.get(launchId);
  abortedLaunch.upcoming = false;
  abortedLaunch.sucess = false;

  return abortedLaunch;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
