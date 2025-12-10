import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserState, UserRole } from "@/types";

const initialState: UserState = {
  user: null,
  userRole: null,
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.error = null;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    clearUser: (state) => {
      state.user = null;
      state.userRole = null;
      state.error = null;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    setUserRole: (state, action: PayloadAction<UserRole | null>) => {
      state.userRole = action.payload;
    },
  },
});

export const { setUser, updateUser, clearUser, setLoading, setError, setUserRole } =
  userSlice.actions;
export default userSlice.reducer;
