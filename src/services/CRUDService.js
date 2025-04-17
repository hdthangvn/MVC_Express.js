import bcrypt from 'bcryptjs'
import db from '../models/index'

const salt = bcrypt.genSaltSync(10);
let createNewUser = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
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
            })

            resolve('ok create a new user succeed!')
        } catch (e) {
            reject(e);
        }
        console.log('data from service')
        
    })
    
}

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

let getAllUser = () => {
    return new Promise(async(resolve, reject) => {
        try {
            let users = db.User.findAll({
                raw: true,
            })
            resolve(users) // cai nay giong return thoi
        } catch (error) {
            reject(e)
        }
    }) 
}

let getUserInfoById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try{
            let user = await db.User.findOne({
                where: { id: userId},
                raw: true,
            })
            
            if(user){
                resolve(user)
            }
            else {
                resolve({})
            }
        }catch(e) {
            reject(e);
        }
    })
}

let updateUserData = (data) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: data.id },
                raw: false // raw: true sẽ trả về plain object, raw: false trả về instance của model
            })
            if(user){
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;

                await user.save();
                let allUsers = await db.User.findAll();
                resolve(allUsers);
            }else{
                resolve();
            }
            
        } catch (e) {
            console.log(e);
        }
    })
}

let deleteUserById = (userId) => {
    return new Promise(async(resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: {id: userId}, // x <- y
                raw: false // raw: true sẽ trả về plain object, raw: false trả về instance của model
            })

            if(user) {
                await user.destroy();
            }
            resolve() // = return 
        } catch (e) {
            reject(e)
        }
    })
}

export default {
    createNewUser,
    hashUserPassword,
    getAllUser,
    getUserInfoById,
    updateUserData,
    deleteUserById
}