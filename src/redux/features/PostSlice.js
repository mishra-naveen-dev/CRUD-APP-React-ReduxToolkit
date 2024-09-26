import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch post by ID
export const getPost = createAsyncThunk('post/getPosts', async ({ id }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;
});

// Async thunk to delete post by ID
export const deletePost = createAsyncThunk('post/deletePosts', async ({ id }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return id;  // Return the ID of the deleted post
});

// Async thunk to create a new post
export const createPost = createAsyncThunk('post/createPosts', async ({ values }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            "Content-type": 'application/json'
        },
        body: JSON.stringify({
            title: values.title,
            body: values.body
        })
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;  // Return the created post data
});

// Async thunk to update a post by ID
export const updatePost = createAsyncThunk('post/updatePosts', async ({ id, title, body }) => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {  // Use post ID in the URL
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            "Content-type": 'application/json'
        },
        body: JSON.stringify({
            title,
            body
        })
    });
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data;  // Return the updated post data
});

// Error handler function
const handleError = (state, action) => {
    state.loading = false;
    state.error = action.error.message;
};

const PostSlice = createSlice({
    name: 'post',
    initialState: {
        loading: false,
        success: false,  // New state to track success
        post: {},  // Object for a single post
        posts: [], // Array for multiple posts if needed in the future
        error: null,
        body: "",
        edit: false
    },
    reducers: {
        setEdit: (state, action) => {
            state.body = action.payload.body;
            state.edit = action.payload.edit;
        },
        clearPostForm: (state) => {  // Clear form data after successful create/update
            state.post = {};
            state.body = "";
            state.edit = false;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetch post action
            .addCase(getPost.pending, (state) => {
                state.loading = true;
                state.success = false;  // Reset success state when fetching starts
                state.error = null;  // Reset error when loading starts
            })
            .addCase(getPost.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;  // Mark success when the fetch is complete
                state.post = action.payload;  // Store fetched post data
                state.error = null;  // Clear any previous errors
            })
            .addCase(getPost.rejected, handleError)

            // Handle delete post action
            .addCase(deletePost.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.post = {};  // Clear post data after deletion
                state.error = null;
            })
            .addCase(deletePost.rejected, handleError)

            // Handle create post action
            .addCase(createPost.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(createPost.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.post = action.payload;  // Store created post data
                state.error = null;
            })
            .addCase(createPost.rejected, handleError)

            // Handle update post action
            .addCase(updatePost.pending, (state) => {
                state.loading = true;
                state.success = false;
                state.error = null;
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                state.loading = false;
                state.success = true;
                state.post = action.payload;  // Update post with new data
                state.error = null;
            })
            .addCase(updatePost.rejected, handleError);
    },
});

export const { setEdit, clearPostForm } = PostSlice.actions;  // Export actions for use in components
export default PostSlice.reducer;
