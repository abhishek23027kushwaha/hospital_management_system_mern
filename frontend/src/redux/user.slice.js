import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage (persist across refresh)
const storedUser = localStorage.getItem("user");
const storedToken = localStorage.getItem("token");

const initialState = {
  user: storedUser ? JSON.parse(storedUser) : null,
  token: storedToken || null,
  isAuthenticated: !!storedUser,
  loading: false,
  error: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // Called after successful login / register / google-auth
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.isAuthenticated = true;
      state.loading = false;
      state.error = null;
      // Persist
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);
    },

    // Update profile fields in-place
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("user", JSON.stringify(state.user));
    },

    // Clear everything on logout
    clearUser: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const { setUser, updateUser, clearUser, setLoading, setError } = userSlice.actions;

// Selectors
export const selectUser          = (state) => state.user.user;
export const selectToken         = (state) => state.user.token;
export const selectIsAuth        = (state) => state.user.isAuthenticated;
export const selectUserLoading   = (state) => state.user.loading;
export const selectUserError     = (state) => state.user.error;

export default userSlice.reducer;
