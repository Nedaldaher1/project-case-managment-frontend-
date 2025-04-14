// store/darkModeSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '@/store/store';

interface DarkModeState {
  isDarkMode: boolean;
}

const initialState: DarkModeState = {
  isDarkMode: typeof window !== 'undefined' 
    ? localStorage.getItem('darkMode') === 'true'
    : false,
};

export const darkModeSlice = createSlice({
  name: 'darkMode',
  initialState,
  reducers: {
    toggle: (state) => {
      state.isDarkMode = !state.isDarkMode;
      if (typeof window !== 'undefined') {
        localStorage.setItem('darkMode', state.isDarkMode.toString());
        document.documentElement.classList.toggle('dark', state.isDarkMode);
      }
    },
    initialize: (state) => {
      if (typeof window !== 'undefined') {
        const savedMode = localStorage.getItem('darkMode') === 'true';
        state.isDarkMode = savedMode;
        document.documentElement.classList.toggle('dark', savedMode);
      }
    }
  },
});
export const selectDarkMode = (state: RootState) => state.darkMode.isDarkMode;

// أو باستخدام createSelector للأداء الأمثل
import { createSelector } from '@reduxjs/toolkit';
export const selectDarkModeState = (state: RootState) => state.darkMode;
export const darkModeSelector = createSelector(
  selectDarkModeState,
  (darkMode) => darkMode.isDarkMode
);


export const { toggle, initialize } = darkModeSlice.actions;
export default darkModeSlice.reducer;