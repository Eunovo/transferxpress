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



const persistConfig = {
  key: "OLYVEPAY_APP_STATE",
  storage: AsyncStorage,
  blacklist: [
    "appReducer",
    "transferReducer",
    "bulkTransferReducer",
    "businessAccountReducer",
    "banksReducer",
    "billPaymentReducer",
  ],
};

const rootReducer = combineReducers({
transferReducer
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
