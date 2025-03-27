import { resolveInclude } from 'ejs';
import db from '../models/index.js';  // Kết nối với cơ sở dữ liệu
import bcrypt from 'bcryptjs';

// Hàm xử lý đăng nhập
let handleUserLogin = (email, password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let userData = {};

            // Kiểm tra xem email có tồn tại trong hệ thống không
            let isExist = await checkUserEmail(email);

            if (isExist) {
                // Nếu email tồn tại, lấy thông tin người dùng từ database
                let user = await db.User.findOne({
                    attributes: ['email', 'roleId', 'password'], // Chỉ lấy các trường cần thiết
                    where: { email: email },
                    raw: true
                });

                if (user) {
                    // So sánh mật khẩu nhập vào với mật khẩu trong database
                    let check = await bcrypt.compareSync(password, user.password);

                    if (check) {
                        userData.errCode = 0;
                        userData.errMessage = 'OK';

                        delete user.password; // Xóa password trước khi trả về để đảm bảo bảo mật
                        userData.user = user;
                    } else {
                        userData.errCode = 3;
                        userData.errMessage = 'Wrong password';
                    }
                } else {
                    userData.errCode = 2;
                    userData.errMessage = `Your email isn't exist in the system. Please try another email.`;
                }

                resolve(userData);
            } else {
                // Nếu email không tồn tại
                userData.errCode = 1;
                userData.errMessage = `Your email isn't exist in the system. Please try another email.`;
                resolve(userData);
            }
        } catch (e) {
            reject(e);
        }
    });
};

// Hàm kiểm tra xem email có tồn tại trong database không
let checkUserEmail = (userEmail) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { email: userEmail }
            });

            resolve(!!user); // Trả về true nếu user tồn tại, ngược lại false
        } catch (e) {
            reject(e);
        }
    });
};

export default {
    handleUserLogin
};
