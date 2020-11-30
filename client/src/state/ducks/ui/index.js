import { createSlice } from '@reduxjs/toolkit';

const peersSlice = createSlice({
  name: 'peers',
  initialState: {},
  reducers: {
    setPeers: (state, { payload }) => {
      return payload;
    },
  }
});

const streamsSlice = createSlice({
  name: 'streams',
  initialState: [],
  reducers: {
    setStreams: (state, { payload }) => {
      return payload;
    }
  }
})
const localStreamSlice = createSlice({
  name: 'localStream',
  initialState: null,
  reducers: {
    setLocalStream: (state, { payload }) => {
      return payload;
    }
  }
});

const socketSlice = createSlice({
  name: 'socket',
  initialState: null,
  reducers: {
    setSocket: (state, { payload }) => {
      return payload;
    }
  }
});

const enableScreenShareSlice = createSlice({
  name: 'screenShare',
  initialState: false,
  reducers: {
    setScreenShare: (state, { payload }) => {
      return payload;
    }
  }
});

export const { setPeers } = peersSlice.actions;
export const { setLocalStream } = localStreamSlice.actions;
export const { setSocket } = socketSlice.actions;
export const { setScreenShare } = enableScreenShareSlice.actions;
export const { setStreams } = streamsSlice.actions;

export default {
  peers: peersSlice.reducer,
  localStream: localStreamSlice.reducer,
  socket: socketSlice.reducer,
  screenShare: enableScreenShareSlice.reducer,
  streams: streamsSlice.reducer,
};
