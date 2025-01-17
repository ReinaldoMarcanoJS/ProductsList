import { createAppSlice } from "@/lib/createAppSlice";
import type { AppThunk } from "@/lib/store";
import { Logged, User } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";

interface appSliceState {
  logged: Logged;
  user: User  
}

const initialState: appSliceState = {
  logged: {
    logged: false,
    token: null,
  },
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    created_at: "",
    updated_at: "",
  },
};

export const appSlice = createAppSlice({
  name: "app",
  initialState,
  reducers: {
    changeLoggedParam: (state, action: PayloadAction<Logged>) => {
      state.logged.logged = action.payload.logged;
      state.logged.token = action.payload.token;
    },
    changeUserParam: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    }
  },
});

export const {changeLoggedParam, changeUserParam} =
  appSlice.actions;


