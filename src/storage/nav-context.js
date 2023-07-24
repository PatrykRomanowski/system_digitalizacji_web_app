import {
    createSlice
} from "@reduxjs/toolkit";

const navContext = createSlice({
    name: "navInfo",

    initialState: {
        actualCategory: "",
    },

    reducers: {
        setActualCategory(state, action) {
            state.actualCategory = action.payload.actual;
        }
    }
});

export const navActions = navContext.actions;

export default navContext;