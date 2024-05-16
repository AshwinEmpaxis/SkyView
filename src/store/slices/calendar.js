import { createSlice } from '@reduxjs/toolkit';
import { dispatch } from '../index';
import axios from 'utils/axios';

const initialState = {
  error: null,
  events: []
};

const slice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    hasError(state, action) {
      state.error = action.payload;
    },
    getEventsSuccess(state, action) {
      state.events = action.payload;
    },
    addEventSuccess(state, action) {
      state.events = action.payload;
    },
    updateEventSuccess(state, action) {
      state.events = action.payload;
    },
    removeEventSuccess(state, action) {
      state.events = action.payload;
    }
  }
});

export default slice.reducer;

export function getEvents() {
  return async () => {
    try {
      const response = await axios.get('/api/calendar/events');
      dispatch(slice.actions.getEventsSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function addEvent(event) {
  return async () => {
    try {
      const response = await axios.post('/api/calendar/events/new', event);
      dispatch(slice.actions.addEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function updateEvent(event) {
  return async () => {
    try {
      const response = await axios.post('/api/calendar/events/update', event);
      dispatch(slice.actions.updateEventSuccess(response.data.events));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

export function removeEvent(eventId) {
  return async () => {
    try {
      const response = await axios.post('/api/calendar/events/remove', { eventId });
      dispatch(slice.actions.removeEventSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}
