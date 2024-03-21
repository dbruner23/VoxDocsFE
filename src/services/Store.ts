import { configureStore } from "@reduxjs/toolkit";
import DocsReducer from "../data/docs/Reducer";

export const store = configureStore({
  reducer: {
    docs: DocsReducer,
  },
});

export default store;
