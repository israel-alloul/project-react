import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

export default function Post({userId}) {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null); // Post שנבחר להצגה
  const [showContent, setShowContent] = useState(false); // מצב להצגת התוכן
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false); // מצב להצגת התגובות
  const [newComment, setNewComment] = useState(""); // שדה להוספת תגובה חדשה
  const [newPostTitle, setNewPostTitle] = useState(""); // כותרת הפוסט החדש
  const [newPostBody, setNewPostBody] = useState(""); // תוכן הפוסט החדש
  const [searchTerm, setSearchTerm] = useState(""); // שדה חיפוש
  const [editingPost, setEditingPost] = useState(null); // Post שנמצא במצב עריכה
  const [editedTitle, setEditedTitle] = useState(""); // כותרת ערוכה
  const [editedBody, setEditedBody] = useState(""); // תוכן ערוך

  // הבאת posts מהשרת
  const fetchPosts = async () => {
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}/posts`);
    const data = await response.json();
    setPosts(data); // הצגת Posts של משתמש 1 בלבד
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // הצגת תוכן של Post שנבחר
  const handleShowContent = (post) => {
    setSelectedPost(post);
    setShowContent(!showContent); // מציג/מסתיר את התוכן
  };

  // הבאת תגובות של Post שנבחר
  const fetchComments = async (postId) => {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts/${postId}/comments`
    );
    const data = await response.json();
    setComments(data);
    setShowComments(true); // הצגת התגובות מתחת לפוסט
  };

  // הוספת תגובה חדשה
  const handleAddComment = () => {
    const newCommentObj = {
      postId: selectedPost.id,
      body: newComment,
      id: comments.length + 1,
    };
    setComments([...comments, newCommentObj]);
    setNewComment(""); // איפוס שדה התגובה
  };

  // הוספת פוסט חדש
  const handleAddPost = () => {
    const newPost = {
      id: posts.length + 1,
      title: newPostTitle,
      body: newPostBody,
      userId: 1,
    };
    setPosts([newPost, ...posts]); // הוספה לראש הרשימה
    setNewPostTitle(""); // איפוס שדות הוספת הפוסט
    setNewPostBody("");
  };

  // מחיקת פוסט
  const handleDeletePost = (postId) => {
    const updatedPosts = posts.filter((post) => post.id !== postId);
    setPosts(updatedPosts); // עדכון רשימת הפוסטים אחרי המחיקה
  };

  // חיפוש פוסט לפי כותרת או מספר סידורי
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // התחלת עריכת פוסט
  const handleEditPost = (post) => {
    setEditingPost(post.id);
    setEditedTitle(post.title);
    setEditedBody(post.body);
  };

  // שמירת העריכה
  const handleSaveEdit = (postId) => {
    const updatedPosts = posts.map((post) =>
      post.id === postId ? { ...post, title: editedTitle, body: editedBody } : post
    );
    setPosts(updatedPosts);
    setEditingPost(null); // יציאה ממצב עריכה
  };

  // ביטול העריכה
  const handleCancelEdit = () => {
    setEditingPost(null); // יציאה ממצב עריכה
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
        onChange={handleSearch}
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
                {/* מצב עריכה */}
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
                {/* מצב תצוגה */}
                {post.id}: {post.title}
                <button onClick={() => handleShowContent(post)} className="toggle-content-button">
                  {showContent && selectedPost?.id === post.id ? "הסתר" : "הצג"}
                </button>
                <button onClick={() => handleEditPost(post)} className="edit-button">ערוך</button>
                <button onClick={() => handleDeletePost(post.id)} className="delete-button">מחק</button>
  
                {/* הצגת תוכן הפוסט */}
                {showContent && selectedPost?.id === post.id && (
                  <div className="post-content">
                    <p>{selectedPost.body}</p>
  
                    {/* כפתור להצגת תגובות */}
                    <button onClick={() => fetchComments(post.id)} className="show-comments-button">
                      הצג תגובות
                    </button>
  
                    {/* הצגת תגובות */}
                    {showComments && (
                      <div className="comments-section">
                        <h3>תגובות:</h3>
                        <ul className="comments-list">
                          {comments.map((comment) => (
                            <li key={comment.id} className="comment-item">{comment.body}</li>
                          ))}
                        </ul>
  
                        {/* הוספת תגובה חדשה */}
                        <input
                          type="text"
                          value={newComment}
                          placeholder="הוסף תגובה"
                          onChange={(e) => setNewComment(e.target.value)}
                          className="new-comment-input"
                        />
                        <button onClick={handleAddComment} className="add-comment-button">הוסף תגובה</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
  
}
