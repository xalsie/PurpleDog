import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthState } from "@/types";

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
      state.error = null;
    },

    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { setAuthenticated, clearAuth, setLoading, setError } =
  authSlice.actions;
export default authSlice.reducer;
