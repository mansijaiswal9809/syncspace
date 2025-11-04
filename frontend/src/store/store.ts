import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import organizationReducer from "./organization";
import myTaskReducer from "./myTaskSlice"

export const store = configureStore({
  reducer: {
    user: userReducer,
    organization: organizationReducer,
    myTask: myTaskReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
