import {
  createSlice
} from "@reduxjs/toolkit";

const userContext = createSlice({
  name: "userInfo",

  initialState: {
    userId: "",
    userEmail: "",
    docCategories: [],
    recipesCategories: [],
    discSpacesUse: 0,
    allocatedDiscSpace: 0,
    actualGalleryRef: "",
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
    addAdditionalInfoAboutUser(state, action) {
      state.discSpacesUse = action.payload.discSpacesUse;
      state.allocatedDiscSpace = action.payload.allocatedDiskSpace;
    },
    newDiscSpacesUse(state, action) {
      state.discSpacesUse = state.discSpacesUse + action.payload.value;
    },
    setActualGalleryRef(state, action) {
      state.actualGalleryRef = action.payload.xd;
    }
  },
});

export const userActions = userContext.actions;

export default userContext;