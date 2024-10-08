const { parse } = require("csv-parse");
const fs = require("fs");
const planets = require("./planets.mongo");
function isHabitablePlanet(planet) {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
}

/*   Asynchronous Data Flow: Because data is flowing in small chunks,
 your application can start processing the data without waiting for the entire file to be read. 
 Each chunk of parsed data triggers the data event handler in your code, allowing you to handle the data asynchronously as soon as it becomes available. */
function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream("data/Kapler_data.csv")
      .pipe(
        parse({
          //pipe: It directs the flow of data from one stream into another. //Connects the read stream to the CSV parser.Data flows from the file into the parser.
          comment: "#", //Lines starting with # are treated as comments and ignored.
          columns: true, //The first line of the CSV is treated as header names for the columns, and each row is converted into an object with keys corresponding to the headers.
        })
      )
      .on("data", async (dataChunk) => {
        if (isHabitablePlanet(dataChunk)) {
          savePlanet(dataChunk);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err); //but we still need reject to pass error
      })
      .on("end", async () => {
        const countPlanets = (await getAllPlanets()).length;
        //This signifies the end of the data flow, but it doesn’t stop other parts of application from running while the data is being processed. so model.export might pass data while still processing
        console.log(`${countPlanets} habiable planets found`);
        resolve(); // we are not pass HabitablePlanet into resolve to be returned, when promies resolved, bacaused we export data out , here we are use promise to ensure data have all been sucessfully loaded before export
      });
  });
}

function getAllPlanets() {
  return planets.find(
    {},
    {
      __v: 0,
      _id: 0,
    }
  ); //returned as an array of documents that match your query criteria
}

async function savePlanet(dataChunk) {
  try {
    await planets.updateOne(
      { keplerName: dataChunk.kepler_name },
      { keplerName: dataChunk.kepler_name },
      { upsert: true }
    );
  } catch (error) {
    console.error(`Could not save planet ${error}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
