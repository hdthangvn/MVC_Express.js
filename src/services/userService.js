import { resolveInclude } from 'ejs';
import db from '../models/index.js';  // Kết nối với cơ sở dữ liệu
import bcrypt from 'bcryptjs';

const salt = bcrypt.genSaltSync(10);

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
                    userData.errMessage = `User's not found.`;
                }

                
            } else {
                // Nếu email không tồn tại
                userData.errCode = 1;
                userData.errMessage = `Your email isn't exist in the system. Please try another email.`;
                
            }

            resolve(userData);
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

            if(user) {
                resolve(true)
            } else {
                resolve(false)
            } // Trả về true nếu user tồn tại, ngược lại false
        } catch (e) {
            reject(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
        try {
            let hashPassword = await bcrypt.hashSync(password, salt);
            resolve(hashPassword);
        } catch (e) {
            reject(e);
        }
    })
}

let getAllUsers = (userId) => {
    return new Promise(async (resolve, reject) => {
        try{
            let users = ''
            if(userId === 'ALL'){
                users = await db.User.findAll({
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            if(userId && userId !== 'ALL'){
                users = await db.User.findOne({
                    where: {id: userId},
                    attributes: {
                        exclude: ['password']
                    }
                })
            }
            resolve(users)
        }catch(e) {
            reject(e);
        }
    })
}

let createNewUser = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("📦 Dữ liệu nhận được từ frontend:", data);
            console.log("🔑 Password nhận được:", data.password);

            // Kiểm tra email
            let check = await checkUserEmail(data.email);
            if (check === true) {
                return resolve({
                    errCode: 1,
                    message: 'Your email is already in use, please try another email.'
                });
            }

            let hashPasswordFromBcrypt = await hashUserPassword(data.password);

            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                phonenumber: data.phonenumber,
                gender: data.gender === '1' ? true : false,
                roleId: data.roleId
            });

            resolve({
                errCode: 0,
                message: 'OK'
            });

        } catch (e) {
            console.error("❌ Lỗi tại createNewUser:", e);
            reject(e);
        }
    });
}

let deleteUser = (userId) => {
    return new Promise (async (resolve, reject) => {
        let user = await db.User.findOne({ // lấy data từ db lên phía nodejs rồi mới dùng hàm này của Sequelize 
            where: { id: userId}           // khi chúng ta đã ép kiểu của raw : true(in config.json) thì Sequelize nó sẽ ko hiểu được
        })
        if(!user){
            resolve({
                errCode: 2,
                errMessage: `The user isn't exist`
            })
        }
            
        await db.User.destroy({ // kết nối với db của ta rồi xóa dưới db
            where: { id: userId } 
        });
        

        resolve({
            errCode: 0,
            message: `The user is deleted`
        })
    })
}

let updateUserData = (data) => {
    return new Promise(async (resolve, rejct) => {
        try {
            if(!data.id){
                resolve({
                    errCode: 2,
                    errMessage: 'Missing required paramaters'
                })
            }
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                // await db.User.save({
                //     firstName: data.firstName,
                //     lastName: data.lastName,
                //     address: data.address
                // })
                
                
                resolve({
                    errCode: 0,
                    message: 'Update the user succeeds!'
                });
            }else{
                resolve({
                    errCode: 1,
                    errMessage: `User's not found!!`
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

export default {
    handleUserLogin, getAllUsers, createNewUser, deleteUser, updateUserData
};
