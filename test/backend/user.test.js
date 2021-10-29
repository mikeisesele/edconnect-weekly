// this tells the test runner to recognize and run this test
/**
 * @jest-environment jsdom
 */

require('dotenv').config();
const regeneratorRuntime = require("regenerator-runtime");
const User = require ("../../server/services/user.js")
const users = require("../mocks/user")
const dbHandler = require("../mocks/database");
const _DEVELOPMENT_ = process.env;

//setup for testing
beforeAll( async () => {

/**
 * Connect to a new in-memory database before running any tests.
 */
  await dbHandler.connect();

  //changes node environment to test
  process.env = { NODE_ENV: "test", ..._DEVELOPMENT_ };
});


// test all methods in the user service
describe("User Service", () => {
  const randomUser = Math.floor(Math.random() * users.length);

     // select a randon user from the list of users
    it("should create and retrieve that user", async () => {
      const createdUser = await User.create(
        randomUser.firstName,
        randomUser.lastName,
        randomUser.email,
        randomUser.password,
        randomUser.matricNumber,
        randomUser.program,
        randomUser.graduationYear,
        randomUser.profilePicture,
      );


      const user = await User.getUserByEmail(randomUser.email);

      expect(createdUser.firstName).toEqual(user.firstName);
      expect(createdUser.email).toEqual(user.firstName);
    })
})

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase())

// after all cleanUp
afterAll(() => {
  /**
   * Remove and close the db and server.
   */
  async () => await dbHandler.closeDatabase();

  // development environment
  process.env = _DEVELOPMENT_;
})
