import { combineReducers } from '@reduxjs/toolkit';

import ui from './ui';

export default combineReducers({
  ...ui,
});