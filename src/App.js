
import "./App.css";

import Home from "./components/Home";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Register from "./components/Register";
import { Routes, Route,useLocation } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Todos from "./components/Todos";
import Album from "./components/Album";
import Post from "./components/Post";
import Photos from "./components/Photos";
import { useState } from "react";

function App() {

const location = useLocation();

const [user,setUser] = useState(null);
console.log(user);

  return (
    <div className="App">
     {location.pathname !== "/login" && <Navbar />} 
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUser={setUser}/>}/>
        <Route path="/dashboard" element={<Dashboard user={user} />}/>
        <Route path="/dashboard/todos" element={<Todos userId={user?.id}/>}/>
        <Route path="/dashboard/album" element={<Album userId={user?.id}/>}/>
        
        <Route path="/dashboard/post" element={<Post userId={user?.id}/>}/>
        <Route path="/dashboard/album/photos" element={<Photos />}/>
        
      </Routes>
    </div>
  );
}

export default App;
