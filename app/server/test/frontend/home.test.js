/**
 * @jest-environment jsdom
 */

const regeneratorRuntime = require("regenerator-runtime");
import React from "react";
import Home from "../../../views/Home";
import { render, screen, fireEvent, cleanUp } from "@testing-library/react";
const users = require("../mocks/user");
const dataProp = require("../mocks/props");

describe("Home", () => {
  // select a randon user from the list of users
  const user = users[3];
  
  render(<Home {...dataProp} />);

  console.log(dataProp);

  test("should render Home page", () => {
    expect(screen.getByText("Welcome to Project Explorer")).toBeInTheDocument();
  });

  test("should render Home page with correct content", () => {
    expect(screen.getByText("Project Explorer")).toBeInTheDocument();
  });

  // test
  test("should render the Jumbotron", () => {
    const { getByTestId } = screen;
    const title = getByTestId("welcomeMessage").textContent;
    expect(title).toEqual("Welcome to Project Explorer");
  });

  test("should render the project card components", () => {
    const { getByTestId } = screen;
    const cards = getByTestId("project-cards").textContent;
    expect(cards).toBeInTheDocument();
  });

  test("should render the navigation bar", () => {
    const header = screen.getByTestId("navigationBar").textContent;
    expect(header).toBeInTheDocument();
  });

  test("should show the user profile picture", () => {
    const profilePicture = screen.getByTestId("profile-picture").textContent;
    expect(profilePicture).toBeInTheDocument();
  });

  test("User firstname shows in Header", () => {
    const userName = screen.getByTestId("username").textContent;
    expect(userName).toEqual("Hi " + user.firstname);
  });
});