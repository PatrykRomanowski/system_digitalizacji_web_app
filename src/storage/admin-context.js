import {
  createSlice
} from "@reduxjs/toolkit";

const adminContext = createSlice({
  name: "adminInfo",

  initialState: {
    allDiscSpaceUse: 0,
    allAllocatedSpace: 0,
    allUsers: null,
  },
  reducers: {
    addValue(state, action) {
      state.allDiscSpaceUse = state.allDiscSpaceUse + action.payload.xd;
    },
    addAllocatedSpace(state, action) {
      state.allAllocatedSpace =
        action.payload.allocatedSpace + state.allAllocatedSpace;
    },
    addUser(state, action) {
      state.allUsers = action.payload.value;
    },
  },
});

export const adminActions = adminContext.actions;

export default adminContext;