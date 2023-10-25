import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

export interface LoginState {
  auth: boolean;
}

const initialState: LoginState = {
  auth: Boolean(localStorage.getItem("auth")) ? Boolean(localStorage.getItem("auth")) : false,
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  // The `reducers` field lets us define reducers and generate associated actions
  reducers: {
    login: (state) => {
      state.auth = true;
      localStorage.setItem("auth", "true");
    },
  },
});

export const { login } = loginSlice.actions;

export const selectLogin = (state: RootState) => state.login.auth;

export default loginSlice.reducer;
