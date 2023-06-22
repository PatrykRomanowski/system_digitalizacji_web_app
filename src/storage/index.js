import { configureStore } from "@reduxjs/toolkit";

import userContext from "./user-context";

const store = configureStore({
  reducer: {
    userStatus: userContext.reducer,
  },
});

export default store;
