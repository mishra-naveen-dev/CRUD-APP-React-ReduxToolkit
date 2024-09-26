import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { createPost } from '../redux/features/PostSlice';
import Spinner from './Spinner';

const CreatePost = () => {
    // Store title and body in local state
    const [values, setValues] = useState({ title: "", body: "" });
    const [showPost, setShowPost] = useState(false);
    const [newPost, setNewPost] = useState(null); // Store newly created post locally
    const { loading, post } = useSelector(state => state.post); // Get the post from Redux state
    const { title, body } = values;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Handle post submission
    const handleSubmit = (e) => {
        e.preventDefault();  // Prevent page refresh on form submission
        if (title && body) {
            const postData = { title, body };
            dispatch(createPost(postData));  // Dispatch createPost action with the form data
            setNewPost(postData); // Set newPost in local state to display it
            setValues({ title: '', body: '' });  // Clear form fields after submission
            setShowPost(true);  // Set showPost to true to trigger post display
        } else {
            window.alert("Both title and body are required to create a post.");
        }
    };

    // Show the newly created post
    const showCreatedPost = () => {
        return (
            <>
                {loading ? <Spinner /> : (
                    newPost && (
                        <div className="card mt-4">
                            <div className="card-body">
                                <h5 className="card-title">{newPost.title}</h5> {/* Show local newPost */}
                                <p className="card-text">{newPost.body}</p> {/* Show local newPost */}
                            </div>
                        </div>
                    )
                )}
            </>
        );
    };

    return (
        <div>
            <h1 className='text-center bg-dark text-white p-2'>Create Post</h1>
            <form onSubmit={handleSubmit}>  {/* Add onSubmit to the form */}
                <div className="mb-3 mt-4">
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setValues({ ...values, title: e.target.value })}
                        placeholder="Enter Post Title"
                        className="form-control"
                        id="exampleInputTitle"
                    />
                </div>
                <div className="form-floating">
                    <textarea
                        className="form-control"
                        value={body}
                        onChange={(e) => setValues({ ...values, body: e.target.value })}
                        placeholder="Add post description"
                        id="floatingTextarea"
                    />
                    <label htmlFor="floatingTextarea">Add post description</label>
                </div>
                <div className="mt-4 d-flex align-items-end justify-content-end">
                    <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => navigate("/")}
                    >
                        Go Home
                    </button>
                    <button
                        className="btn btn-danger ms-4"
                        type="submit"  // Use submit for form submission
                    >
                        Submit
                    </button>
                </div>
            </form>

            <div className="mt-4">
                {showPost && <div>{showCreatedPost()}</div>}  {/* Display newly created post */}
            </div>
        </div>
    );
};

export default CreatePost;
