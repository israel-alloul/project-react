import React, { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

// עיצוב מינימלי
const styles = {
  container: {
    width: "300px",
    margin: "100px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
    backgroundColor: "#f9f9f9",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  input: {
    margin: "10px 0",
    padding: "8px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
    fontSize: "12px",
    margin: "10px 0",
  },
};

const Login = ({setUser}) => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:3000/api/users")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched users:", data); // בדיקה האם הנתונים מגיעים
        setUsers(data);
      })
      .catch((error) => console.error("Error fetching users:", error));
  }, []);
  

  // ניהול state עבור username, password ושגיאה
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  
  // פונקציית כניסה שמבצעת בדיקות אם המשתמש מורשה
  const handleLogin = (e) => {
    e.preventDefault(); // מניעת רענון הדף בעת שליחת הטופס

    for (let i = 0; i < users.length; i++) {
      if (users[i].username === username && users[i].website === password) {
        // אם המשתמש מורשה
        setError(""); // איפוס הודעת השגיאה
        setUser(users[i])
        alert("התחברת בהצלחה!");
        // שמירת הנתונים ב-Local Storage לדוגמה
        localStorage.setItem("loggedInUser", JSON.stringify(users[i]));
        
        // ניתוב לעמוד אחר במקרה של הצלחה
        navigate("/dashboard");
      }
    }
    // אם הכניסה נכשלה
    setError("שם משתמש או סיסמה שגויים");
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-container">
      <h2>התחברות</h2>
      <form onSubmit={handleLogin} className="login-form">
        <div>
          <label>שם משתמש:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
        </div>
        <div>
          <label>סיסמה:</label>
          <br></br>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </div>
        {error && <p className="login-error">{error}</p>}
        <button type="submit" className="login-button">
          כניסה
        </button>
      </form>
    </div>
  );
  
};

export default Login;
