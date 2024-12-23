const request = require("supertest"); //It allows you to make HTTP requests to your Express.js (or any other Node.js-based) application without needing to start the server on a specific port.
const app = require("../../app");
const {
  mongoConnect,
  mongoDisconnet,
} = require("../../utils/mongooseConnection");

const { loadPlanetsData } = require("../../model/planets.model");
describe("launch Api", () => {
  beforeAll(async () => {
    await mongoConnect(); //when we running test file, just required app, actually don't start srever,
    await loadPlanetsData(); // so mongoConnect() and loadPlanetsData() didn't actually be connected,  here so we have to load it again
  });

  afterAll(async () => {
    await mongoDisconnet();
  });
  describe("Test Get /launches", () => {
    test("should respond with 200 success", async () => {
      await request(app)
        .get("/v1/launches") // initiates a GET request to the /launches endpoint of  app.
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe(" test post /launches", () => {
    const launchData = {
      mission: "keplor exploration X",
      rocket: "explore cici",
      launchDate: "december 27,2023",
      target: "Kepler-1652 b",
    };
    const launchDataNODate = {
      mission: "keplor exploration X",
      rocket: "explore cici",
      target: "Kepler-1652 b",
    };
    const launchDataInvalidDate = {
      mission: "keplor exploration X",
      rocket: "explore cici",
      target: "Kepler-1652 b",
      launchDate: "hello",
    };
    test("should respond with 201", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchData)
        .expect("Content-Type", /json/)
        .expect(201);
      const requestDate = new Date(launchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(requestDate).toBe(responseDate);

      expect(response.body).toMatchObject(launchDataNODate);
    });

    test("should catch missing properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataNODate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "missing required launch property",
      });
    });
    test("should catch invalid properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "invalid launch date",
      });
    });
  });
});
