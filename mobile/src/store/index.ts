import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  persistStore,
  persistReducer,
  // FLUSH,
  // REHYDRATE,  TODO uncomment before moving to production or making a build
  // PAUSE,
  // PERSIST,
  // PURGE,
  // REGISTER,
} from "redux-persist";
import transferReducer from "./transfer/slice"
import userReducer from "./user/slice"
import depositReducer from "./deposit/slice"

const persistConfig = {
  key: "TRANSFERXPRESS_APP_STATE",
  storage: AsyncStorage,
  blacklist: [
    "transferReducer",
    "depositReducer"
  ],
};

const rootReducer = combineReducers({
  userReducer,
transferReducer,
depositReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
      // {
      //   ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      // },
    }),
});

//  persisted store
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
