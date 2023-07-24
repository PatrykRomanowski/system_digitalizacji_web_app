import {
  configureStore
} from "@reduxjs/toolkit";

import userContext from "./user-context";
import navContext from "./nav-context";

const store = configureStore({
  reducer: {
    userStatus: userContext.reducer,
    navStatus: navContext.reducer,
  },
});

export default store;