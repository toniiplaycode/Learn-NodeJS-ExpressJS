// const express = require('express'); // nạp(import) thư viện express vào, cú pháp ES5
import express from 'express'; // cú pháp ES7 mới hơn, phải cấu hình babel mới chạy được cú pháp mới
import configViewEngine from './configs/viewEngine';
import initWebRoute from './route/web'; // nạp function initWebRoute từ file web.js vào
import initAPIRoute from './route/api'; // nạp function initAPIRoute từ file api.js vào
require('dotenv').config(); // nạp package dotenv vào, nếu không nạp thì lệnh process.env.PORT sẽ lỗi
const morgan = require('morgan'); // nạp(import) thư viện morgan vào
const app = express(); // express là một function được viết sẵn và mình chỉ cần gọi hàm và dùng
// const port = 8080; // cổng, có thể đặt cổng tuỳ thích: 3000, 8080...
const port = process.env.PORT || 3000; // dùng để gán tham số PORK bên file .env cho biến pork(nhưng muốn sử dụng được lệnh proess.env.PORK này thì phải cài package dotenv), và || 8080 để dự phòng nếu file môi trường bị lỗi;

// express.urlencoded(), express.json() dùng để hỗ trợ client gửi data lên sever và lấy được data vừa được gửi lên đó
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//--> urlencoded, json là 1 middleware để định dạng dữ liệu

app.use(morgan('combined')); // dùng logger tiêu chuẩn 'combined' của thư viện morgan để hiện được tất request, còn nhiều kiểu khác như 'commom', 'dev', 'short', 'tiny' (lên trang npm morgan xem thêm) 
//--> morgan() là 1 middleware để in ra log

app.use((req, res, next) => {
    console.log('run into my middleware: ', req.method);
    next(); // dùng hàm next để tiếp tục thực thi các hàm bên dưới
});

// setup view engine
configViewEngine(app); // truyền đối số express vào hàm configViewEngine 

// tham số thứ nhất '/' là một route, kiểu đường dẫn vào website, tham số thứ 2 là callback, trong callback gồm 2 tham số: request và response
// app.get('/', (req, res) => {
//     res.send('Hello World!');
// })

// thử 1 route(đường dẫn) khác
// app.get('/about', (req, res) => {
//     res.send('i am Toniiplaycode');
// });

// app.get('/', (req, res) => { 
//     res.render('index.ejs'); // dùng để chạy file ejs template engine, không cần tìm đường dẫn thư mục vì bên file viewEngine.js nó đã tìm đường dẫn tới file index.ejs giúp mình rồi 
// });

//init web route
initWebRoute(app); // các routes được tách qua bên file web.js, không viết trong file server.js này như ở trên nữa, truyền đối số app (express)

//init api route
initAPIRoute(app); // các API được xử lý trong file api.js, truyền đối số app (express)

//handle 404 not found
app.use((req, res) => { // dùng middleware để xử lý khi vào đường dẫn (route) không tồn tại, middleware này chạy khi 2 hàm initWebRoute và initAPIRoute không return về được 1 route nào (2 hàm đó đều return về 1 route nếu đường dẫn đúng) thì middleware này sẽ được chạy và return render file 404.ejs
    return res.render('404.ejs')
});

app.listen(port, () => { // app.listen được hiểu là mình muốn chạy trên cổng nào, ở đây là cổng 3000
    console.log(`Example app listening at http: //Localhost:${port}`);
});

