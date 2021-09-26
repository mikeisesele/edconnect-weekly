/**
 * @jest-environment jsdom
 */

require('dotenv').config();
const regeneratorRuntime = require("regenerator-runtime");
const Project = require("../../services/project.js");
const mongoose = require("mongoose");
const dbHandler = require("../mocks/database");
const projects = require("../mocks/project.js");

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


// test all methods in the project service
describe("Project Service", () => {
    // test createProject
    test("createProject", async () => {
        const project = await Project.create(projects[3]);
        expect(project).toBeTruthy();
    });
        
    // test getProjects
    test("getProjects", async () => {
        const projects = await Project.getAll();
        expect(projects).toBeTruthy();
    });
});

/**
 * Clear all test data after every test.
 */
afterEach(async () => await dbHandler.clearDatabase());


// after all cleanUp
afterAll(() => {
  /**
   * Remove and close the db and server.
   */
  async () => await dbHandler.closeDatabase();

  // development environment
  process.env = _DEVELOPMENT_;
})