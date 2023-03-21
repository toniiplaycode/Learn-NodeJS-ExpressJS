import express from "express"; // nạp thư viện express vào
import {getHomePage, getDetailPage, createNewUser, deleteUser, getEditPage, postUpdateUser, getUploadFilePage, handleUploadFile, handleUploadMultipleFiles} from "../controller/homeController";
import multer from 'multer'; // nạp(import) thư viện multer vào để xử lý upload files
import path from 'path'; // nạp thư viện path theo thư viện multer

var appRoot = require('app-root-path'); // dùng thư viện app-root-path
let router = express.Router(); // hàm router() của thư viện express

// đoạn code multer.diskStorage này là copy code thư viện về dùng (chỉ cần hiểu cách hoạt động là được). Nó dùng để chứa file khi được upload lên
const storage = multer.diskStorage({
    destination: function(req, file, cb) { // destination(đích đến) dùng để xác định thư mục nào sẽ chứa các file khi được upload lên
        cb(null, appRoot + '/src/public/images/'); // dẫn đường vào folder images để lưu file ảnh
    },
    // By default, multer removes file extensions so let's add them back
    filename: function(req, file, cb) { // filename này để đặt tên unique lại cho file được upload lên, để tránh bị trùng
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// đoạn code này copy thư viện về dùng để validation tên file trước khi được upload lên, chỉ chấp nhận file ảnh
const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

// code này làm theo ask IT (upload 1 file)
let upload = multer({ storage: storage, fileFilter: imageFilter });

// code này làm theo ask IT (upload nhiều files)
let uploadMultipleFiles = multer({ storage: storage, fileFilter: imageFilter }).array('multiple_images', 3); // chỉ tối da up được 3 file cùng lúc

const initWebRoute = (app) => { // các route sẽ được tách ra riêng và chung trong 1 function initWebRoute, tham số app (là express)
    router.get('/', getHomePage); // hàm getHomePage được viết bên file homeController

    // thử 1 route(đường dẫn) khác
    router.get('/about', (req, res) => {
        res.send('i am Toniiplaycode');
    });

    // khi click vào nút detail trên từng user thì nó chuyển sang route thông qua ID của user
    router.get('/detail/user/:id', getDetailPage); // biến trong route, ví dụ như :id là mình tự đặt

    // khi click vào nút create để thêm mới user thì sẽ lấy value từ form và post lên DB
    router.post('/create-new-user', createNewUser); // route /create-new-user bên action của form cũng giống vậy 

    // khi click vào nút delete để xoá user theo ID
    router.get('/delete-user/:id', deleteUser);

    // khi click vào nút edit để sửa user theo ID
    router.get('/edit-user/:id', getEditPage);

    // khi click vào nút edit để thì sẽ chuyển sang route /update-user để sửa data của user và cập nhật lại trên DB
    router.post('/update-user', postUpdateUser); // route /update-user bên action của form cũng giống vậy 

    // chuyển sang trang upload files
    router.get('/upload', getUploadFilePage);

    // action của form HTML trong file uploadFile.ejs khi up file lên
    router.post('/upload-profile-pic', upload.single('profile_pic'), handleUploadFile); // tham số thứ 2 là middleware, upload được định nghĩa ở trên

    // làm theo upload nhiều files của ask IT, upload nhiều files khó vl, middleware của route này được được code inline
    router.post('/upload-multiple-images', (req, res, next) => {
        uploadMultipleFiles(req, res, (err) => {
            if (err instanceof multer.MulterError && err.code === "LIMIT_UNEXPECTED_FILE") {
                // handle multer file limit error here
                res.send('LIMIT_UNEXPECTED_FILE')
            } else if (err) {
                res.send(err)
            }
            else {
                // make sure to call next() if all was well
                next(); // nếu request hợp lệ thì cho tiếp tục vào hàm handleUploadMultipleFiles để xử lý
            }
        })
    }, handleUploadMultipleFiles);

    return app.use('/', router); // app.use('/', router) dùng để gắn một router middleware vào một đường dẫn cụ thể, ở đây '/' là đường dẫn gốc, ví dụ http://localhost:8080/ là vào được trang index.ejs, http://localhost:8080/about là hiện 'i am Toniiplaycode'. Nếu ví dụ mình thêm tiền tố app.use('/trangchu' router) thì http://localhost:8080/trangchu là vào được trang index.ejs, http://localhost:8080/trangchu/about là hiện 'i am Toniiplaycode'
}


export default initWebRoute;
