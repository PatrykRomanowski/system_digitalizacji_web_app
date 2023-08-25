import { configureStore } from "@reduxjs/toolkit";

import userContext from "./user-context";
import navContext from "./nav-context";
import adminContext from "./admin-context";

const store = configureStore({
  reducer: {
    userStatus: userContext.reducer,
    navStatus: navContext.reducer,
    adminStatus: adminContext.reducer,
  },
});

export default store;
