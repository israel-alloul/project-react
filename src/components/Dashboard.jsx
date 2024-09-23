import React from 'react'
import { Link, Routes, Route } from 'react-router-dom'
import Todos from "./Todos";
import Album from "./Album";
import Post from "./Post";

function Dashboard({user}) {
    console.log(user);
    
  return (
    <div className="dashboard-container">
      <h1>Dashboard</h1>
      {user && <h2>Hi {user.name}</h2>}
        
      <div className="dashboard-buttons">
        <Link to="/dashboard/todos">
          <button>Todos</button>
        </Link>
        <Link to="/dashboard/album">
          <button>Album</button>
        </Link>
        <Link to="/dashboard/post">
          <button>Post</button>
        </Link>
      </div>

      {/* ניהול ה-Routes */}
      <Routes>
        <Route path="/dashboard/todos" element={<Todos />} />
        <Route path="/dashboard/album" element={<Album />} />
        <Route path="/dashboard/post" element={<Post />} />
      </Routes>
    </div>
  )
}

export default Dashboard;
