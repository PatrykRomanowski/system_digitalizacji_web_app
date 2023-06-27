import { createSlice } from "@reduxjs/toolkit";

const userContext = createSlice({
  name: "userInfo",

  initialState: {
    userId: "",
    userEmail: "",
    docCategories: [],
    recipesCategories: [],
  },
  reducers: {
    login(state, action) {
      state.userEmail = action.payload.userEmail;
      state.userId = action.payload.userId;
    },
    logOut(state) {
      state.userEmail = "";
      state.userId = "";
    },
    addDocCategories(state, action) {
      state.docCategories = action.payload.value;
    },
    addRecipesCategories(state, action) {
      state.recipesCategories = action.payload.value;
    },
  },
});

export const userActions = userContext.actions;

export default userContext;
