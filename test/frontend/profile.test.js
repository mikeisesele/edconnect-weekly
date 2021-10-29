/**
 * @jest-environment jsdom
 */

const regeneratorRuntime = require("regenerator-runtime");
import React from "react";
import ProfileDetail from "../../views/ProfileDetail";
import { render, screen, fireEvent, cleanUp } from "@testing-library/react";
const prop = require("../mocks/props");

// tests the profile detail page
describe("Profile Detail Page", () => {
  beforeEach(() => {
    render(<ProfileDetail {...prop} />);
  });

  it("should render the email detail", () => {
    expect(screen.getByTestId("email").textContent).toEqual("email2@gmail.com");
  });

  it("should render the matriculation number", () => {
    expect(screen.getByTestId("matriculation-number").textContent).toEqual(
      "222222222"
    );
  });

  it("should render the program", () => {
    expect(screen.getByTestId("program").textContent).toEqual(
      "Computer Science"
    );
  });

});