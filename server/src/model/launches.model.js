const launches = require("./launches.mongo");
const planets = require("./planets.mongo");
const axios = require("axios");
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
  const planet = await planets.findOne({
    keplerName: launch.target,
  });
  if (!planet) {
    throw new Error("no matching planet found");
  }

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
  await launches.findOneAndUpdate(
    //updateOne, have  __setONinsert in data
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    { upsert: true } // insert launch if flightNumber doesn't exist
  );
}
saveLaunch(launch);

async function getAllLaunches() {
  return await launches.find({}, { __v: 0, _id: 0 });
}

async function existsLaunchWithId(launchId) {
  return await launches.findOne({ flightNumber: launchId });
}

async function abortLaunchById(launchId) {
  /*   const abortedLaunch = launches.get(launchId);
  abortedLaunch.upcoming = false;
  abortedLaunch.sucess = false; */
  const abortedLaunch = await launches.updateOne(
    { flightNumber: launchId },
    { upcoming: false, sucess: false }
  ); //no { upsert: true } dont insert updateData if flightNumber doesn't exist
  return abortedLaunch.acknowledged && abortedLaunch.matchedCount === 1;
}

const SPACE_API_URL = "https://api.spacexdata.com/v4/launches/query";
async function loadSpaceXData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("launch data already loaded");
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launches.findOne(filter);
}

async function populateLaunches() {
  console.log("Downloading launch data.....");
  const response = await axios.post(SPACE_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",

          select: {
            name: 1, //1:include this field in the result."
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });
  const spaceXAll = response.data.docs;
  for (const spaceX of spaceXAll) {
    const payloads = spaceX["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]); // flaten all customers into a array

    const history = {
      flightNumber: spaceX["flight_number"],
      mission: spaceX["name"],
      rocket: spaceX["rocket"]["name"],
      launchDate: spaceX["date_local"],
      upcoming: spaceX["upcoming"],
      success: spaceX["success"],
      customers,
    };
    console.log(`${history.flightNumber} ${history.mission}`);
    await saveLaunch(history);
  }
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadSpaceXData,
};
