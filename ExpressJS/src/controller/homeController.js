//  khi import bên từ file connectDB thì nó sẽ tự động kết nối với DB return res.render('index', {dataUsers: data, testVar: 'test biến'});
// import connection from '../configs/connectDB'; // dùng connection
import pool from '../configs/connectDB'; // dùng pool
import multer from 'multer'; // nạp(import) thư viện multer vào để xử lý upload files

let getHomePage = async (req, res) => {
    //#1 cách kết nối DB và render biến ra HTML bình thường (dùng connection)
    // let data = [];
    // connection.query(
    //     ' SELECT * FROM users ',
    //     function(err, results, fields) {
    //         console.log(results); // results contains rows returned by server
    //         // console.log(fields); // fields contains extra meta data about results, if available
    //         data = results;

    //         return res.render('index.ejs', {dataUsers: data, testVar: 'test biến'}); // dùng để chạy file ejs template engine, không cần tìm đường dẫn thư mục vì bên file viewEngine.js nó đã tìm đường dẫn tới file index.ejs giúp mình rồi, tham số thứ 2 là 1 object, có key và value, key sẽ được gọi bên file index.ejs để hiển thị lên HTML
    //     }
    // );

    // #2 cách kết nối DB và render biến ra HTML khi dùng promise (dùng pool)
    const [rows, fields] = await pool.execute(' SELECT * FROM  users ');
    // console.log('check users: ' ,rows); // biến rows giống biến results khi dùng connection, đều là trảparams về mảng users
    return res.render('index.ejs', {dataUsers: rows, testVariable: 'NodeJS with ASKIT'}); // ygan cách #1 nhưng chỉ khác value của key dataUsers là rows
}

let getDetailPage = async (req, res) => {
    let userId = req.params.id; // req.params là mình lấy các biến mình truyền vào route ở file web.js, in ra dưới dạng object (key, value), ở đây mình sẽ lấy id của từng user, vì bên file index.ejs mình gán thuộc tính href của button là id
    // console.log(userId);
    const [user, fields] = await pool.execute(' SELECT * FROM users WHERE id = ?', [userId]); // lấy user thông qua id
    console.log(user); // chỉ lấy phần results, không lấy phần fields
    return res.send(JSON.stringify(user)); 
}

let createNewUser = async (req, res) => {
    console.log(req.body); // req.body lấy ra data trong form được post lên server dạng object, các tên key được đặt trong name của mỗi thẻ input trong form bên file index.ejs

    let {firstName, lastName, email, address} = req.body;
    await pool.execute('INSERT INTO users(firstName, lastName, email, address) values(?, ?, ?, ?)', [firstName, lastName, email, address]); //insert mới user vào DB

    return res.redirect('/'); // dùng để trở về route home '/' sau khi insert xong 
}

let deleteUser = async (req, res) => {
    let userId = req.params.id;
    await pool.execute('DELETE FROM users WHERE id = ?', [userId]);

    return res.redirect('/'); // dùng để trở về route home '/' sau khi delete user xong 
}

let getEditPage =  async (req, res) => {
    let userId = req.params.id;
    const [row, field] = await pool.execute(' SELECT * FROM users WHERE id = ?', [userId]);
    return res.render('update.ejs', {dataUser: row[0]}); // render biến row ra file update.ejs bên folder views, row là mảng, các data của user được chứa trong object của mảng ở index đầu tiên là 0
}

let postUpdateUser = async (req, res) => {
    console.log(req.body);
    let {id, firstName, lastName, email, address} = req.body;
    await pool.execute('UPDATE users SET firstName = ?, lastName = ?, email = ?, address = ? WHERE id = ?', [firstName, lastName, email, address, id]);
    return res.redirect('/'); // dùng để trở về route home '/' sau khi update user xong
}

let getUploadFilePage = async (req, res) => {
    return res.render('uploadFile.ejs');
}

// code này làm theo ask IT (upload 1 file)
let handleUploadFile = async (req, res) => { // code trong hàm handleUploadFile này là copy code thư viện về và có chỉnh sửa. Nó dùng để upload file lên, có các if else để báo lỗi validation, chưa chọn ảnh mà submit,... ở cuối hàm nếu upload thành công thì hiện ảnh đó ra HTML luôn
    // 'profile_pic' is the name of our file input field in the HTML form
    console.log('check file: ', req.file); // trong multer có tham số tên là file, console.log ra để xem 
    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.file) {
        return res.send('Please select an image to upload');
    }

    // Display uploaded image for user validation
    res.send(`You have uploaded this image: <hr/><img src="/images/${req.file.filename}" width="500"><hr /><a href="/upload">Upload another image</a>`);
    // });
}

// code này làm theo ask IT (upload nhiều files)
let handleUploadMultipleFiles = async (req, res) => {
    if (req.fileValidationError) {
        return res.send(req.fileValidationError);
    }
    else if (!req.files) {
        return res.send('Please select an image to upload');
    }

    let result = "You have uploaded these images: <hr />";
    const files = req.files;
    console.log('check files: ', req.files); // trong multer có tham số tên là files, console.log ra để xem
    let index, len;

    // Loop through all the uploaded images and display them on frontend
    for (index = 0, len = files.length; index < len; ++index) {
        result += `<img src="/images/${files[index].filename}" width="300" style="margin-right: 20px;">`;
    }
    result += '<hr/><a href="/upload">Upload more images</a>';
    res.send(result);

}

export {getHomePage, getDetailPage, createNewUser, deleteUser, getEditPage, postUpdateUser, getUploadFilePage, handleUploadFile, handleUploadMultipleFiles}