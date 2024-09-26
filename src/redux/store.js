import { configureStore } from "@reduxjs/toolkit";
import postReducer from "../redux/features/PostSlice";


const store = configureStore({
    reducer: {
        post: postReducer,  // Ensure your PostSlice is added here
    },
});

export default store;
