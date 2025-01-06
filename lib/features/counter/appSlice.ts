import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface appSliceState {
  logged: boolean;
}

const initialState: appSliceState = {
  logged: false,
};

export const appSlice = createAppSlice({
  name: "app",
  initialState,
  reducers: {
    changeLoggedParam: (state, action: PayloadAction<appSliceState>) => {
      state.logged = action.payload.logged;
    },
  },
});

export const {changeLoggedParam} =
  appSlice.actions;


