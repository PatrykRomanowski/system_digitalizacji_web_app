import {
  createSlice
} from "@reduxjs/toolkit";

const userContext = createSlice({
  name: "userInfo",

  initialState: {
    userId: "",
    userEmail: "",
    actualSite: 1,
    docCategories: [],
    recipesCategories: [],
    discSpacesUse: 0,
    allocatedDiscSpace: 0,
    actualGalleryRef: "",
    isActive: null,
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
      state.isActive = action.payload.isActive;
    },
    newDiscSpacesUse(state, action) {
      state.discSpacesUse = state.discSpacesUse + action.payload.value;
    },
    setActualGalleryRef(state, action) {
      state.actualGalleryRef = action.payload.xd;
    },
    setActualSiteOfBook(state, action) {
      state.actualSite = action.payload.actual;
    },
    deleteItem(state, action) {
      state.discSpacesUse = state.discSpacesUse - action.payload.sizeFiles;
    },
  },
});

export const userActions = userContext.actions;

export default userContext;