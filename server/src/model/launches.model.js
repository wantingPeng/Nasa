const launches = new Map();
let latestFlightNumber = 100;
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

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      flightNumber: latestFlightNumber,
      customer: ["Nasa", "cici"],
      upcoming: true,
      sucess: true,
    })
  );
}
launches.set(launch.flightNumber, launch);

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
  launches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
};
