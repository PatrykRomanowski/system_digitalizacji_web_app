import React from "react";
import { renderWithProviders } from "./testUtils"; // Importuje renderWithProviders z pliku testUtils.js
import { screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect"; // Importuj jest-dom
import { act } from "react-dom/test-utils";

import { userEvent } from "@testing-library/user-event";
import { useNavigate, MemoryRouter } from "react-router-dom";

import LoginPage from "./loginPage";
import { auth2 } from "./firebase";
import { signInWithEmailAndPassword as mockSignInWithEmailAndPassword } from "firebase/auth";

jest.mock("firebase/auth"); // Mock Firebase Authentication
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: jest.fn(),
  };
});

describe("loginTest", () => {
  // test("render component", () => {
  //   renderWithProviders(<LoginPage />);
  // });

  test("render login button", () => {
    renderWithProviders(<LoginPage />);
    const loginButton = screen.getByRole("button", { name: "Zaloguj" });
    expect(loginButton).toBeInTheDocument();
  });

  test("render back button", () => {
    renderWithProviders(<LoginPage />);
    const loginButton = screen.getByRole("button", {
      name: "Wróć do strony głównej",
    });
    expect(loginButton).toBeInTheDocument();
  });

  test("paragraph render", () => {
    renderWithProviders(<LoginPage />);
    const nameElement4 = screen.getByText("Jeśli nie posiadasz konta");
    expect(nameElement4).toBeInTheDocument();
  });

  test("login test", async () => {
    const loginHandlerSpy = jest.fn();
    renderWithProviders(<LoginPage />);

    userEvent.setup();
    const email = "test10@test.com"; // Dodaj zmienną email
    const password = "testtest"; // Dodaj zmienną password
    const emailInput = screen.getByTestId("email-input");
    const passwordInput = screen.getByTestId("password-input");

    await act(async () => await userEvent.type(emailInput, email));
    await act(async () => await userEvent.type(passwordInput, password));

    const loginButton = screen.getByRole("button", {
      name: "Zaloguj",
    });

    await act(async () => await userEvent.click(loginButton));
    expect(mockSignInWithEmailAndPassword).toHaveBeenCalledWith(
      auth2,
      email,
      password
    );
  });

  test("input login test", async () => {
    renderWithProviders(<LoginPage />);
    const emailInput = screen.getByTestId("email-input");

    await act(async () => await userEvent.type(emailInput, "test10@test.com"));

    const loginValue = emailInput.value;

    expect(loginValue).toBe("test10@test.com");
  });

  test("input password test", async () => {
    renderWithProviders(<LoginPage />);
    const passwordInput = screen.getByTestId("password-input");

    await act(async () => await userEvent.type(passwordInput, "test1test"));

    const passwordValue = passwordInput.value;

    // Teraz możesz użyć odczytanej wartości w swojej asercji.
    expect(passwordValue).toBe("test1test"); // Przykładowa asercja
  });

  test("goBackHandler navigates to the home page", async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    renderWithProviders(<LoginPage />);

    const goBackButton = screen.getByTestId("button-back");
    await act(async () => await userEvent.click(goBackButton));

    expect(navigate).toHaveBeenCalledWith("/");
  });

  test("goBackHandler navigates to the register Page", async () => {
    const navigate = jest.fn();
    useNavigate.mockReturnValue(navigate);

    renderWithProviders(<LoginPage />);

    const registerButton = screen.getByTestId("button-register");
    await act(async () => await userEvent.click(registerButton));

    expect(navigate).toHaveBeenCalledWith("/register");
  });
});
