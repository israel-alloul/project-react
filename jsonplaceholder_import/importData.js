const axios = require('axios');
const mysql = require('mysql2/promise');

// הגדרת חיבור ל-MySQL
const connection = mysql.createPool({
  host: 'localhost',
  user: 'root', // שנה בהתאם לפרטי המשתמש שלך
  password: '123456', // שנה את הסיסמה שלך
  database: 'jsonplaceholder_db'
});

// פונקציה להכנסת נתונים לטבלאות
async function insertData(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const query = `INSERT INTO ${table} (${keys.join(',')}) VALUES (${values.map(() => '?').join(',')})`;
  await connection.execute(query, values);
}

// ייבוא נתונים מ-API והכנסתם ל-MySQL
async function fetchData() {
  try {
    // 1. ייבוא משתמשים
    const usersResponse = await axios.get('https://jsonplaceholder.typicode.com/users');
    const users = usersResponse.data.slice(0, 5); // לקחת 5 משתמשים בלבד

    for (const user of users) {
      const { id, name, username, email, phone, website, address, company } = user;
      const userData = {
        id,
        name,
        username,
        email,
        phone,
        website,
        address_street: address.street,
        address_suite: address.suite,
        address_city: address.city,
        address_zipcode: address.zipcode,
        address_geo_lat: address.geo.lat,
        address_geo_lng: address.geo.lng,
        company_name: company.name,
        company_catchPhrase: company.catchPhrase,
        company_bs: company.bs
      };

      await insertData('Users', userData);
    }

    // 2. ייבוא פוסטים
    const postsResponse = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const posts = postsResponse.data.filter(post => post.userId <= 5);

    for (const post of posts) {
      await insertData('Posts', post);
    }

    // 3. ייבוא תגובות
    const commentsResponse = await axios.get('https://jsonplaceholder.typicode.com/comments');
    const comments = commentsResponse.data.filter(comment => posts.some(post => post.id === comment.postId));

    for (const comment of comments) {
      await insertData('Comments', comment);
    }

    // 4. ייבוא אלבומים
    const albumsResponse = await axios.get('https://jsonplaceholder.typicode.com/albums');
    const albums = albumsResponse.data.filter(album => album.userId <= 5);

    for (const album of albums) {
      await insertData('Albums', album);
    }

    // 5. ייבוא תמונות
    const photosResponse = await axios.get('https://jsonplaceholder.typicode.com/photos');
    const photos = photosResponse.data.filter(photo => albums.some(album => album.id === photo.albumId));

    for (const photo of photos) {
      await insertData('Photos', photo);
    }

    // 6. ייבוא משימות
    const todosResponse = await axios.get('https://jsonplaceholder.typicode.com/todos');
    const todos = todosResponse.data.filter(todo => todo.userId <= 5);

    for (const todo of todos) {
      await insertData('Todos', todo);
    }

    console.log('ייבוא נתונים הושלם בהצלחה!');
  } catch (error) {
    console.error('שגיאה בייבוא הנתונים:', error);
  }
}

fetchData();
