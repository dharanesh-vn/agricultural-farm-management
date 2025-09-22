import { configureStore } from '@reduxjs/toolkit';
import auctionReducer from '../features/auction/auctionSlice';

export const store = configureStore({
  reducer: {
    // We can add more reducers here later
    auction: auctionReducer,
  },
});