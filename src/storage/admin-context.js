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
    changeDataForUser(state, action) {
      state.allUsers = state.allUsers.map((user) => {

        console.log(action.payload.itemId)
        console.log(user);
        console.log(user.itemId)

        if (user.itemId === action.payload.itemId) {
          const item = {
            itemId: user.itemId,
            allocatedDiskSpace: action.payload.allocadedSpaceUsed,
            diskSpaceUsed: user.diskSpaceUsed,
            email: user.email,
            isAdmin: user.isAdmin,
            isActive: user.isActive,
          }
          return item;
        }
        return user;
      })
    },
    deleteUser(state, action) {
      state.allUsers = state.allUsers.filter((user) => {
        return user.itemId !== action.payload.itemId;
      })
    },
    addNewTotalDiskUsed(state) {
      let totalAllocatedSpace = 0;

      if (state.allUsers) {
        state.allUsers.forEach((user) => {
          totalAllocatedSpace += user.allocatedDiskSpace;
        });
      }

      // Aktualizujemy stan allAllocatedSpace na podstawie obliczeń
      state.allAllocatedSpace = totalAllocatedSpace;
    }
  },
});

export const adminActions = adminContext.actions;

export default adminContext;