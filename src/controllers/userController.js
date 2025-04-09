import userService from "../services/userService"

// Hàm xử lý đăng nhập
let handleLogin = async (req, res) => {
    console.log("Request body:", req.body);
    
    let email = req.body.email;
    console.log('your email: ' + email);
    let password = req.body.password;

    // Kiểm tra xem email và password có bị thiếu không
    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing input parameters!'
        });
    }

    // Gọi service để kiểm tra tài khoản người dùng
    let userData = await userService.handleUserLogin(email, password);
    console.log(userData)
    // Trả về phản hồi JSON với kết quả kiểm tra đăng nhập
    return res.status(200).json({
        errCode: userData.errCode,   // Mã lỗi (0 nếu thành công, 1 nếu thất bại)
        message: userData.errMessage, // Thông báo lỗi hoặc thành công
        user: userData.user ? userData.user : { 'a': 'abc' } // Thông tin user nếu đăng nhập thành công
    });
}

let handleGetAllUsers = async (req,res) => {
    let id = req.body.id; // ALL, ID

    if(!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing required parmaters',
            users: []
        })
    }

    let users = await userService.getAllUsers(id);
    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        users 
    })
}

export default {
    handleLogin, handleGetAllUsers
};
