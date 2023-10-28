import React from "react";
import { renderWithProviders } from "../testUtils";
import { screen } from "../testUtils";
import { act } from "react-dom/test-utils";
import "@testing-library/jest-dom/extend-expect"; // Ta linijka jest ważna

import HeaderUser from "./headerUser";

describe("header user test", () => {
  test("render component", () => {
    renderWithProviders(<HeaderUser />);
  });

  test("render login button", () => {
    renderWithProviders(<HeaderUser />);
    const loginButton = screen.getByTestId("button-setting");
    expect(loginButton).toBeInTheDocument();
  });
});
