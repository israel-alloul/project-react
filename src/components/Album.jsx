import React from 'react'
import  { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


export default function Album({userId}) {
    const [album, setAlbum] = useState(null);
    
  const fetchAlbum = async () => {
    const response = await fetch(`http://localhost:3000/api/users/${userId}/albums`);
    const data = await response.json();
    setAlbum(data);
  };


  useEffect(() => {
    fetchAlbum();
  }, []);


  
    return (
        <div className="album-container">
            <h1>Album</h1>
           
            <Link to="/dashboard/">
          <button>Dashboard</button>
        </Link>
          {album ? (
            <div>
              {album.map((item, ind) => {
                
                  return <li key={ind}className="album-list" ><Link to = {"/dashboard/album/photos"} state={item.id} >{item.id}:{item.title}</Link></li>; // החזרת ה-p חייבת להיות עם return
                
                return null; // במקרה שה-item לא עונה על התנאי, יש להחזיר null
              })}
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      );
  
}
