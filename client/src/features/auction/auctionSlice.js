import { createSlice } from '@reduxjs/toolkit';
const initialState = { auction: null, bids: [], isLoading: true };
const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    setAuction: (state, action) => { state.auction = action.payload; state.isLoading = false; },
    updateBid: (state, action) => {
      if (state.auction) {
          state.auction.currentBid = action.payload.currentBid;
          state.auction.highestBidderName = action.payload.highestBidderName;
      }
      state.bids.push(action.payload.newBid);
    },
    clearAuction: (state) => { state.auction = null; state.bids = []; },
  },
});
export const { setAuction, updateBid, clearAuction } = auctionSlice.actions;
export default auctionSlice.reducer;