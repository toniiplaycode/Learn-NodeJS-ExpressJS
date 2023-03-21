import express from "express"; 
import {getAllUsers, createNewUser, updateUser, deleteUser} from "../controller/APIController";

let router = express.Router();

const initAPIRoute = (app) => { // 4 hàm bên dưới là chuẩn RESTfull API
    router.get('/users', getAllUsers); // -> phương thức GET dùng để lấy users
    router.post('/create-user', createNewUser); // -> phương thức POST dùng để tạo user
    router.put('/update-user', updateUser); // -> phương thức PUT dùng để update user
    router.delete('/delete-user', deleteUser); // -> phương thức DELETE dùng để xoá user (dùng body)
    // router.delete('/delete-user/:id', deleteUser); // -> phương thức DELETE dùng để xoá user (dùng param)

    return app.use('/api/v1', router); // '/api/v1' là đường link url ban đầu 
}

export default initAPIRoute;
