// testUtils.js

import React from "react";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { render } from "@testing-library/react";
import store from "./storage";

function renderWithProviders(ui) {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/"]}>{ui}</MemoryRouter>
    </Provider>
  );
}

export * from "@testing-library/react";
export { renderWithProviders };
