import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import loginReducer from "../features/login/loginSlice";
import tableReducer from "../features/table/tableSlice";

export const store = configureStore({
  reducer: { login: loginReducer, table: tableReducer },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
