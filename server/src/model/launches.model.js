const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "keplor exploration X",
  rocket: "explore 1",
  launchDate: new Date("decenber 27,2023"),
  destination: "Kepler-1652 b",
  customer: ["Nasa", "cici"],
  upcoming: true,
  sucess: true,
};
launches.set(launch.flightNumber, launch);
module.exports = { launches };
