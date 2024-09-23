import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';



function Photos() {
  const [photos, setPhotos] = useState([]);
  const [visiblePhotos, setVisiblePhotos] = useState(5); // מספר התחלתי של תמונות להצגה
  const [loading, setLoading] = useState(false); // סטייט לטעינה
  const [hasMore, setHasMore] = useState(true); // כדי לדעת אם יש עוד תמונות
  const location = useLocation();
  const id = location.state;
  
  const fetchPhotos = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/photos');
    const data = await response.json();
    setPhotos(data);
  };


  
  useEffect(() => {
    fetchPhotos();
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500 && !loading && hasMore) {
        // אם המשתמש גולל לתחתית הדף ויש עוד תמונות לטעון
        setLoading(true);
        setTimeout(() => {
          setVisiblePhotos((prev) => {
            const nextVisiblePhotos = prev + 5;
            // בודקים אם יש עוד תמונות להציג
            if (nextVisiblePhotos >= photos.filter((item) => item.albumId === id).length) {
              setHasMore(false); // אין עוד תמונות לטעון
            }
            return nextVisiblePhotos;
          });
          setLoading(false);
        }, 1000); // דיליי קטן לדימוי טעינה
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, photos]);
  return (
    <div className="photos-container">
      <h1>תמונות</h1>
      {/* <h2>{users.name}</h2> */}
      <Link to="/dashboard/">
          <button>Dashboard</button>
        </Link>
      {photos.length > 0 ? (
        <ol className="photos-list">
          {photos
            .filter((item) => item.albumId === id) // מסנן לפי albumId
            .slice(0, visiblePhotos) // מציג רק את כמות התמונות שנקבעה
            .map((item, ind) => (
              <li key={ind}>
                <p>{item.title}</p>
                <img src={item.thumbnailUrl} alt={item.title} />
              </li>
            ))}
        </ol>
      ) : (
        <p>Loading...</p>
      )}
      {loading && <p>טוען עוד תמונות...</p>}
      {!hasMore && <p>אין עוד תמונות להציג</p>}
    </div>
  );
}
export default Photos;