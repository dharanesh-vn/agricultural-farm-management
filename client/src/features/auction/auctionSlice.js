import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  auctionStatus: 'inactive', // 'inactive', 'active', 'ended'
  currentItem: null,
  currentBid: 0,
  highestBidderName: null,
  timeLeftSeconds: 0,
  messages: [],
};

export const auctionSlice = createSlice({
  name: 'auction',
  initialState,
  reducers: {
    startAuction: (state, action) => {
      state.auctionStatus = 'active';
      state.currentItem = action.payload.item;
      state.currentBid = action.payload.item.startingBid;
      state.timeLeftSeconds = action.payload.durationSeconds;
      state.highestBidderName = 'No bids yet';
      state.messages = [action.payload.startMessage];
    },
    updateBid: (state, action) => {
      state.currentBid = action.payload.newBid;
      state.highestBidderName = action.payload.bidderName;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    tickTimer: (state, action) => {
      state.timeLeftSeconds = action.payload.timeLeft;
    },
    endAuction: (state, action) => {
      state.auctionStatus = 'ended';
      state.messages.push(action.payload.endMessage);
    },
    resetAuctionRoom: (state) => {
      state.auctionStatus = 'inactive';
      state.currentItem = null;
      state.currentBid = 0;
      state.highestBidderName = null;
      state.messages = [];
    }
  },
});

export const { startAuction, updateBid, addMessage, tickTimer, endAuction, resetAuctionRoom } = auctionSlice.actions;
export default auctionSlice.reducer;