import { createSlice } from "@reduxjs/toolkit";

const userContext = createSlice({
  name: "userInfo",

  initialState: { userId: "", userEmail: "" },
  reducers: {
    login(state, action) {
      state.userEmail = action.payload.userEmail;
      state.userId = action.payload.userId;
    },
    logOut(state) {
      state.userEmail = "";
      state.userId = "";
    },
  },
});

export const userActions = userContext.actions;

export default userContext;
