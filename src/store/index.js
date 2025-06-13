import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// Base API
import { baseApi } from '@/lib/baseRTKQuery';

// Import reducers
import homeworkAssistantReducer from './reducers/HA';
import smartSolutionCheckReducer from './reducers/SSC';
import aiMathTutorReducer from './reducers/AMT';
import authReducer from './reducers/authReducer';
import loadingReducer from './reducers/loadingReducer';
import userProfileReducer from './reducers/userProfileReducer';

// Import API slices
import { authApi } from './slices/authApi';
import { profileApi } from './slices/profile';
import { paymentApi } from './slices/payment';
import { homeworkAssistantApi } from './slices/HA';
import { smartSolutionCheckApi } from './slices/SSC';
import { aiMathTutorApi } from './slices/AMT';
import { feedbackAPi } from './slices/feedback';

const createNamespacedStorage = () => {
  return {
    getItem: (key) => {
      const itemKey = `mathingo-db:${key}`;
      return storage.getItem(itemKey);
    },
    setItem: (key, value) => {
      const itemKey = `mathingo-db:${key}`;
      return storage.setItem(itemKey, value);
    },
    removeItem: (key) => {
      const itemKey = `mathingo-db:${key}`;
      return storage.removeItem(itemKey);
    },
  };
};

const namespacedStorage =
  typeof window !== 'undefined' ? createNamespacedStorage() : storage;

const rootReducer = combineReducers({
  // API reducers
  [baseApi.reducerPath]: baseApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [profileApi.reducerPath]: profileApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
  [homeworkAssistantApi.reducerPath]: homeworkAssistantApi.reducer,
  [smartSolutionCheckApi.reducerPath]: smartSolutionCheckApi.reducer,
  [aiMathTutorApi.reducerPath]: aiMathTutorApi.reducer,
  [feedbackAPi.reducerPath]: feedbackAPi.reducer,

  // Regular reducers
  homeworkAssitant: homeworkAssistantReducer,
  smartSolutionCheck: smartSolutionCheckReducer,
  aiMathTutor: aiMathTutorReducer,
  userProfile: userProfileReducer,
  auth: authReducer,
  loading: loadingReducer,
});

const persistConfig = {
  key: 'root',
  storage: namespacedStorage,
  blacklist: [
    baseApi.reducerPath,
    authApi.reducerPath,
    profileApi.reducerPath,
    paymentApi.reducerPath,
    homeworkAssistantApi.reducerPath,
    smartSolutionCheckApi.reducerPath,
    aiMathTutorApi.reducerPath,
    feedbackAPi.reducerPath,
  ],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat([baseApi.middleware]),
  });

  return store;
};

export const store = makeStore();
export const persistor = persistStore(store);

export const resetAllState = () => {
  // Auth and user related resets
  store.dispatch(authSlice.actions.resetAuth());
  store.dispatch(userProfileSlice.actions.resetUserDetails());

  // Feature specific resets
  store.dispatch(homeworkAssistantSlice.actions.resetQuestion());
  store.dispatch(homeworkAssistantSlice.actions.resetAnswer());
  store.dispatch(aiMathTutorSlice.actions.resetQuestion());
  store.dispatch(aiMathTutorSlice.actions.resetAnswer());
  store.dispatch(smartSolutionCheckSlice.actions.resetQuestion());
  store.dispatch(smartSolutionCheckSlice.actions.resetAnswer());

  // Loading state reset
  store.dispatch(loadingSlice.actions.resetLoadingStates());

  // Reset API cache
  store.dispatch(baseApi.util.resetApiState());
};
