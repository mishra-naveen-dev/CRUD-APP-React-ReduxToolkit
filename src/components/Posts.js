import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deletePost, getPost, setEdit, updatePost } from './../redux/features/PostSlice';
import Spinner from './Spinner';

export const Posts = () => {
    const [id, setId] = useState('');
    const [textBody, setTextBody] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { loading, post, error, body, edit } = useSelector(state => state.post);

    useEffect(() => {
        if (body) {
            setTextBody(body); // Set textBody from Redux state body
        }
    }, [body]);

    const handleFetchData = (e) => {
        e.preventDefault();
        if (id && id > 0) {
            dispatch(getPost({ id }));
            setId('');
        } else {
            window.alert("Please provide a valid Post ID");
        }
    };

    const handleDeletePost = () => {
        const confirmDelete = window.confirm("Are you sure you want to delete this post?");
        if (confirmDelete) {
            dispatch(deletePost({ id: post.id }));
            window.alert("Post Deleted!");
        }
    };

    const handleSaveEdit = () => {
        if (textBody.trim()) {
            dispatch(updatePost({ id: post.id, title: post.title, body: textBody }));
            dispatch(setEdit({ edit: false, body: "" })); // Exit edit mode
        } else {
            window.alert("Post body cannot be empty");
        }
    };

    const handleCancelEdit = () => {
        dispatch(setEdit({ edit: false, body: "" })); // Exit edit mode without saving
    };

    return (
        <>
            <div className="row mt-4 d-flex align-items-center justify-content-center">
                <div className='col-md-8'>
                    <form>
                        <div className="mb-3">
                            <label htmlFor="exampleInputId" className="form-label">Search By ID:</label>
                            <input
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                type="number"
                                className="form-control"
                                id="exampleInputId"
                                aria-describedby="idHelp"
                                min="1"
                                placeholder="Enter Post ID"
                            />
                        </div>
                        <button onClick={handleFetchData} type="submit" className="btn btn-primary">Fetch Post</button>
                        <button onClick={() => navigate('/createpost')} type="button" className="btn btn-warning ms-4">Create Post</button>
                    </form>
                </div>
            </div>

            {/* Show Loading, Error, or Post Data */}
            <div className="container mt-4">
                {loading ? (
                    <Spinner />
                ) : (
                    <>
                        {error && <p className="text-danger">Error: {error}</p>}
                        {post && post.title && post.body && (
                            <div className="card mt-4">
                                <div className="card-body">
                                    <h5 className="card-title">{post.title}</h5>
                                    {edit ? (
                                        <>
                                            <textarea
                                                className="form-control"
                                                value={textBody}
                                                onChange={(e) => setTextBody(e.target.value)}
                                                id="floatingTextarea"
                                            />
                                            <div className="d-flex align-items-end justify-content-end mt-3">
                                                <button className="btn btn-primary" onClick={handleSaveEdit}>Save</button>
                                                <button className="btn btn-danger ms-4" onClick={handleCancelEdit}>Cancel</button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <p className="card-text">{post.body}</p>
                                        </>
                                    )}
                                    {!edit && (
                                        <div className="d-flex align-items-end justify-content-end mt-3">
                                            <button className="btn btn-primary" onClick={() => dispatch(setEdit({ edit: true, body: post.body }))}>Edit</button>
                                            <button className="btn btn-danger ms-4" onClick={handleDeletePost}>Delete</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};
