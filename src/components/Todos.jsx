import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export default function Todos({ userId }) {
  const [todos, setTodos] = useState([]);
  
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortCriteria, setSortCriteria] = useState("default");
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [editTodoId, setEditTodoId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  // הבאת רשימת todos מהשרת
  const fetchTodos = async () => {
    const response = await fetch(
      `http://localhost:3000/api/users/${userId}/todos`
    );
    const data = await response.json();

    setTodos(data);
    setFilteredTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, [userId]);

  // סינון לפי קריטריון חיפוש
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    setFilteredTodos(
      todos.filter((item) => {
        // אם החיפוש הוא מספרי, חפש לפי התאמה מלאה ל-id
        if (!isNaN(term) && term !== "") {
          return item.id.toString() === term;
        }

        // חיפוש לפי כותרת או מצב השלמה
        return (
          item.title.toLowerCase().includes(term) ||
          (item.completed ? "completed" : "not completed").includes(term)
        );
      })
    );
  };

  // סידור לפי קריטריון שנבחר
  const handleSort = (e) => {
    const criteria = e.target.value;
    setSortCriteria(criteria);
    let sortedTodos = [...filteredTodos]; // משתמשים ב- filteredTodos במקום todos

    if (criteria === "serial") {
      sortedTodos.sort((a, b) => Number(a.id) - Number(b.id)); // מיון לפי מספר סידורי כערך מספרי
    } else if (criteria === "alphabetical") {
      sortedTodos.sort((a, b) => a.title.localeCompare(b.title)); // לפי סדר אלפביתי
    } else if (criteria === "completed") {
      sortedTodos.sort((a, b) => Number(b.completed) - Number(a.completed)); // לפי מצב ביצוע
    } else if (criteria === "random") {
      sortedTodos.sort(() => Math.random() - 0.5); // סדר אקראי
    }

    setFilteredTodos(sortedTodos); // עדכון הרשימה המסוננת
  };

  const handleAddTodo = async () => {
    if (!newTodoTitle) {
      alert("Please enter a title for the todo");
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:3000/api/users/todos/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          title: newTodoTitle,
          completed: false,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error adding todo:", errorData);
        return;
      }
  
      const newTodo = await response.json();
      console.log("New todo added:", newTodo);
      
  
      // עדכון הסטייט עם המשימה החדשה
      setTodos((prevTodos) => {
        const updatedTodos = [...prevTodos, newTodo];
        setFilteredTodos(updatedTodos); // עדכון הרשימה המסוננת גם כן
        return updatedTodos;
      });  
      // איפוס שדה הטקסט
      setNewTodoTitle("");
  
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };
  

  // שינוי מצב ביצוע
  const toggleCompleted = (id) => {
    const updatedTodos = todos.map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );
    setTodos(updatedTodos);
    setFilteredTodos(updatedTodos);
  };

  // מחיקת משימה
  const handleDeleteTodo = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/users/todos/delete/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error deleting todo:", errorData);
        return;
      }

      const data = await response.json();
      console.log(data.message);
      setTodos(todos.filter((item) => item.id !== id));
      setFilteredTodos(todos.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  // התחלת עריכת משימה
  const handleEditTodo = (id, title) => {
    setEditTodoId(id);
    setEditedTitle(title);
  };

  // שמירת עריכה ועדכון בשרת
  const handleSaveEdit = async (id) => {
    try {
      // שליחת בקשת PUT לשרת לצורך עדכון המשימה
      const response = await fetch(`http://localhost:3000/api/users/todos/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: editedTitle, completed: todos.find((todo) => todo.id === id).completed }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error updating todo:", errorData);
        return;
      }

      const updatedTodos = todos.map((item) =>
        item.id === id ? { ...item, title: editedTitle } : item
      );
      setTodos(updatedTodos);
      setFilteredTodos(updatedTodos);
      setEditTodoId(null);
      setEditedTitle("");
    } catch (error) {
      console.error("Error saving edited todo:", error);
    }
  };

  // ביטול עריכה
  const handleCancelEdit = () => {
    setEditTodoId(null);
    setEditedTitle("");
  };

  return (
    <div className="todos-container">
      <h2>משימות</h2>
      <Link to="/dashboard/">
        <button>Dashboard</button>
      </Link>
      <br></br>
      {/* שדה חיפוש */}
      <input
        type="text"
        placeholder="חפש לפי כותרת, מספר או מצב"
        value={searchTerm}
        onChange={handleSearch}
      />

      {/* רשימת סינון */}
      <select value={sortCriteria} onChange={handleSort}>
        <option value="default">בחר קריטריון סינון</option>
        <option value="serial">לפי מספר סידורי</option>
        <option value="alphabetical">לפי סדר אלפביתי</option>
        <option value="completed">לפי מצב ביצוע</option>
        <option value="random">סדר אקראי</option>
      </select>

      {/* הוספת משימה */}
      <div>
        <input
          type="text"
          placeholder="הוסף משימה חדשה"
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <button onClick={handleAddTodo}>הוסף משימה</button>
      </div>

      {/* הצגת רשימת המשימות */}
      <ul className="todos-list">
        {filteredTodos.map((item) => (
          <li key={item.id}>
            <span>{item.id}. </span>
            {editTodoId === item.id ? (
              <>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />
                <button onClick={() => handleSaveEdit(item.id)}>שמור</button>
                <button onClick={handleCancelEdit}>ביטול</button>
              </>
            ) : (
              <>
                {item.title}
                <button onClick={() => handleEditTodo(item.id, item.title)}>
                  ערוך
                </button>
              </>
            )}
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleCompleted(item.id)}
            />
            <button onClick={() => handleDeleteTodo(item.id)}>מחק</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
/****************************************
 * 
 * 
 * 
 * 
 * 
 * 
 * ***************************** */