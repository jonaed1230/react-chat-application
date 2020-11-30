import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';

import reducer from './ducks';
const middleware = [...getDefaultMiddleware()];

export default function configureDucksStore(preloadedState = {}) {
  return configureStore({
    middleware,
    reducer,
    preloadedState,
    devTools: process.env.NODE_ENV !== 'production',
  });
}
