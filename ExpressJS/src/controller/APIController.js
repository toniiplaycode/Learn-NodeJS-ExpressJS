import pool from '../configs/connectDB'; // dùng pool

let getAllUsers = async (req, res) => {
    const [rows, fields] = await pool.execute(' SELECT * FROM  users '); // lấy tất cả users từ DB

    return res.status(200).json({ // hàm này trả về 1 HTTP response với status 200(thành công) và trả về 1 JSON object
        message: 'OK',
        data: rows // trả về tất cả users
    });
    //--> trả về 1 api có đầy đủ data của tất cả users, nếu dùng REACT, ANGULAR, VUE... thì dựa vào API này để render ra giao diện
    
}

let createNewUser = async (req, res) => { // bên file homeController cũng có hàm createNewUser, nhưng hàm đó tạo user từ form HMTL và post lên DB, còn createNewUser trong file này cũng cùng chức năng là tạo user nhưng tạo bằng API, không dùng forn HTML
    let {firstName, lastName, email, address} = req.body; 
    //Hàm createNewUser bên file homeController nó lấy dữ liệu được nhập từ form HTML, còn hàm createNewUser này phải thêm data trong body để gửi lên server, vào app Postman để thêm data vào body trước khi gửi lên server
    if (!firstName || !lastName || !email || !address) { // validation nếu truyền data không đầy đủ trong body để insert vào DB thì trả về massage này 
        return res.status(200).json({
            message: 'missing required params, not enough params in body!'
        });
    }

    await pool.execute('INSERT INTO users(firstName, lastName, email, address) values(?, ?, ?, ?)', [firstName, lastName, email, address]); //insert mới user vào DB

    return res.status(200).json({ // nếu đã truyền đủ data trong body thì trả về massage này, và data đã được insert vào DB rồi 
        message: 'OK'
    });
}

let updateUser = async (req, res) => { // cơ chế giống hàm createNewUser ở trên, nhưng có thêm data id trong body để update user theo id
    let {id, firstName, lastName, email, address} = req.body;
    if (!id || !firstName || !lastName || !email || !address) {
        return res.status(200).json({
            message: 'missing required params, not enough params in body!'
        });
    }

    await pool.execute('UPDATE users SET firstName = ?, lastName = ?, email = ?, address = ? WHERE id = ?', [firstName, lastName, email, address, id]);

    return res.status(200).json({
        message: 'OK'
    });
}

// #1(dùng body) truyền data id trong body để xoá user
let deleteUser = async (req, res) => { // cơ chế giống hàm createNewUser ở trên
    let {id} = req.body;
    if (!id) {
        return res.status(200).json({
            message: 'missing required params, not enough params in body!'
        });
    }

    await pool.execute('DELETE FROM users WHERE id = ?', [id]);

    return res.status(200).json({
        message: 'OK'
    });
}

// #2(dùng params) truyền /<id> trên thanh URL để xoá user
// let deleteUser = async (req, res) => { // cơ chế giống hàm createNewUser ở trên
//     let id = req.params.id;
//     if (!id) {
//         return res.status(200).json({
//             message: 'missing required params, not enough params in body!'
//         });
//     }
    
//     await pool.execute('DELETE FROM users WHERE id = ?', [id]);

//     return res.status(200).json({
//         message: 'OK'
//     });
// }


export{getAllUsers, createNewUser, updateUser, deleteUser}