// const mysql = require('mysql2'); // nạp thư viện mysql2 (cú pháp cũ)
// import mysql from 'mysql2'; // nạp thư viện mysql2 (cú pháp mới)
import mysql from 'mysql2/promise'; // nạp thư viện mysql2 (cú pháp mới) có dùng promise

//#1 dùng connection để kết nối với DB 
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',  
//   database: 'nodejsbasic'
// });

//#2 dùng pool để kết nối với DB (tối ưu hoá hơn connection)
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database: 'nodejsbasic'
});

// export ra ngoài để có thể kết nối với DB
// export default connection;
export default pool;