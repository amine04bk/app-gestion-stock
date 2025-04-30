import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./Redux/usersReduce";
export default configureStore({
  reducer: {
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false,}),
});
