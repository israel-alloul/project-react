import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Post({userId}) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostBody, setNewPostBody] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedBody, setEditedBody] = useState("");

  // פונקציה להורדת הפוסטים מהשרת
  const fetchPosts = async () => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}/posts`);
    const data = await response.json();
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // פונקציה להצגת תוכן של פוסט שנבחר
  const handleShowContent = (post) => {
    setSelectedPost(post);
    setShowContent(!showContent);
  };

  // פונקציה להורדת התגובות של הפוסט שנבחר
  const fetchComments = async (postId) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    const data = await response.json();
    setComments(data);
    setShowComments(true);
  };

  // פונקציה להוספת תגובה חדשה
  const handleAddComment = () => {
    const newCommentObj = {
      postId: selectedPost.id,
      body: newComment,
      id: comments.length + 1,
    };
    setComments([...comments, newCommentObj]);
    setNewComment("");
  };

  // פונקציה להוספת פוסט חדש
  const handleAddPost = async () => {
    if (!newPostTitle || !newPostBody) {
      alert("Please enter both title and body");
      return;
    }

    const response = await fetch(`http://localhost:3000/api/users/posts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: userId,
        title: newPostTitle,
        body: newPostBody,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error adding post:", errorData);
      return;
    }

    const newPost = await response.json();
    setPosts([newPost, ...posts]);
    setNewPostTitle("");
    setNewPostBody("");
  };

  // פונקציה לחיפוש פוסטים
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // פונקציה למחיקת פוסט
  const handleDeletePost = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/posts/delete/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error deleting post:', errorData);
        return;
      }

      const updatedPosts = posts.filter((post) => post.id !== postId);
      setPosts(updatedPosts);
      setSelectedPost(null);
      setShowContent(false);
      setShowComments(false);

      console.log("Post deleted successfully");
    } catch (error) {
      console.error("Error during delete request:", error);
    }
  };

  // פונקציה להתחלת עריכת פוסט
  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditedTitle(post.title);
    setEditedBody(post.body);
  };

  // פונקציה לשמירת עריכת הפוסט
  const handleSaveEdit = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/users/posts/update/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          title: editedTitle,
          body: editedBody,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error editing post:', errorData);
        return;
      }

      const updatedPost = await response.json();
      const updatedPosts = posts.map((post) =>
        post.id === postId ? { ...post, title: editedTitle, body: editedBody } : post
      );
      setPosts(updatedPosts);
      setEditingPost(null);
      console.log("Post edited successfully");
    } catch (error) {
      console.error("Error during edit request:", error);
    }
  };

  // פונקציה לביטול עריכה
  const handleCancelEdit = () => {
    setEditingPost(null);
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.id.toString().includes(searchTerm)
  );

  return (
    <div className="post-container">
      <h1>Posts</h1>
      <Link to="/dashboard/">
        <button className="dashboard-button">Dashboard</button>
      </Link>

      {/* שדה חיפוש */}
      <input
        type="text"
        placeholder="חפש לפי כותרת או מספר"
        value={searchTerm}
        onChange={handleSearch} // עדכון השדה באמצעות הפונקציה handleSearch
        className="search-input"
      />

      {/* הוספת פוסט חדש */}
      <div className="new-post">
        <input
          type="text"
          placeholder="כותרת חדשה"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          className="new-post-title"
        />
        <input
          type="text"
          placeholder="תוכן חדש"
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
          className="new-post-body"
        />
        <button onClick={handleAddPost} className="add-post-button">הוסף פוסט</button>
      </div>

      <ul className="posts-list">
        {filteredPosts.map((post) => (
          <li key={post.id} className="post-item">
            {editingPost === post.id ? (
              <div className="edit-post">
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="edit-post-title"
                />
                <input
                  type="text"
                  value={editedBody}
                  onChange={(e) => setEditedBody(e.target.value)}
                  className="edit-post-body"
                />
                <button onClick={() => handleSaveEdit(post.id)} className="save-button">שמור</button>
                <button onClick={handleCancelEdit} className="cancel-button">בטל</button>
              </div>
            ) : (
              <div className="view-post">
                {post.id}: {post.title}
                <button onClick={() => handleShowContent(post)} className="toggle-content-button">
                  {showContent && selectedPost?.id === post.id ? "הסתר" : "הצג"}
                </button>
                <button onClick={() => handleEditPost(post)} className="edit-button">ערוך</button>
                <button onClick={() => handleDeletePost(post.id)} className="delete-button">מחק</button>
              </div>
            )}
            {showContent && selectedPost?.id === post.id && (
              <div className="post-content">
                <p>{post.body}</p>
                <button onClick={() => fetchComments(post.id)} className="toggle-comments-button">
                  {showComments ? "הסתר תגובות" : "הצג תגובות"}
                </button>
                {showComments && (
                  <ul className="comments-list">
                    {comments.map((comment) => (
                      <li key={comment.id} className="comment-item">{comment.body}</li>
                    ))}
                  </ul>
                )}
                <input
                  type="text"
                  placeholder="הוסף תגובה"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="new-comment-input"
                />
                <button onClick={handleAddComment} className="add-comment-button">הוסף תגובה</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
