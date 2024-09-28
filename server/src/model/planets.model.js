const { parse } = require("csv-parse");
const fs = require("fs");

const HabitablePlanet = [];
function isHabitablePlanet(planet) {
  return (
    planet.koi_disposition === "CONFIRMED" &&
    planet.koi_insol > 0.36 &&
    planet.koi_insol < 1.11 &&
    planet.koi_prad < 1.6
  );
}
fs.createReadStream("data/Kapler_data.csv")
  .pipe(
    parse({
      //pipe: It directs the flow of data from one stream into another. //Connects the read stream to the CSV parser.Data flows from the file into the parser.
      comment: "#", //Lines starting with # are treated as comments and ignored.
      columns: true, //The first line of the CSV is treated as header names for the columns, and each row is converted into an object with keys corresponding to the headers.
    })
  )
  .on("data", (dataChunk) => {
    if (isHabitablePlanet(dataChunk)) {
      HabitablePlanet.push(dataChunk);
      console.log(dataChunk);
    }
  })
  .on("error", (err) => console.log(err))
  .on("end", () => {
    const planetName = HabitablePlanet.map((planet) => planet.kepler_name);
    console.log(planetName);
    console.log(`${HabitablePlanet.length} habiable planets found`);
  });
