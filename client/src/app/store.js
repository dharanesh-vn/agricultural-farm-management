import { configureStore } from '@reduxjs/toolkit';
import auctionReducer from '../features/auction/auctionSlice';
export const store = configureStore({
  reducer: {
    auction: auctionReducer,
  },
});