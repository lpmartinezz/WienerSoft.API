import mongoose from "mongoose";
import * as fs from 'fs'
import { stringify } from "querystring";
import Jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { JWT_SECRET, JWT_EXPIRES } from "../config.js";

const userSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    country: String,
    departament: String,
    estate: String,
    city: String,
    address: String,
    phone: String,
    birthdate: Date,
    email: String,
    password: String,
    image: String
}, {versionKey:false});

const UserModel = new mongoose.model('users', userSchema);

export const getUsers = async(req, res) => {
    try {
        const {id} = req.params
        const rows =
        (id === undefined) ? await UserModel.find() : await UserModel.findById(id)
        return res.status(200).json({ status: true, data: rows})
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error]})
    }
}

export const saveUsers = async(req, res) => {
    try {
        const { 
            userName, 
            firstName, 
            lastName, 
            country, 
            departament, 
            estate, 
            city, 
            address, 
            phone, 
            email, 
            birthdate, 
            password 
        } = req.body
        const validate = validateUsers(userName, firstName, lastName, phone, email, birthdate, password, req.file, 'Y')
        if (validate == '') {
            let pass = await bcryptjs.hash(password, 8)
            const newUsers = new UserModel({
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                country: country,
                departament: departament,
                estate: estate,
                city: city,
                address: address,
                phone: phone,
                email: email,
                birthdate: birthdate,
                password: pass,
                image: '/uploads/' + req.file.filename
            })
            return await newUsers.save().then(
                () => { res.status(200).json({status: true, message: 'Create User'})}
            )
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const updateUsers = async(req, res) => {
    try {
        const {id} = req.params
        const { userName, firstName, lastName, country, departament, estate, city, address, phone, email, birthdate, password } = req.body
        let image = ''
        let values = { userName : userName, firstName : firstName, lastName : lastName, country : country, departament : departament, estate : estate, city : city, address : address, phone : phone, email : email, birthdate : birthdate, password : password }
        if (req.file != null) {
            image = './uploads/' + req.file.filename
            values = { userName : userName, firstName : firstName, lastName : lastName, country : country, departament : departament, estate : estate, city : city, address : address, phone : phone, email : email, birthdate : birthdate, password : password, image : image }
            await deleteImage(id)
        }
        const validate = validateUsers(userName, firstName, lastName, phone, email, birthdate, password)
        if (validate == '') {
            await UserModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, message: 'Update User'})
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const deleteUsers = async(req, res) => {
    try {
        const {id} = req.params
        await deleteImage(id)
        await UserModel.deleteOne({_id:id})
        return res.status(200).json({status:true, message: 'Delete User'})
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const loginUsers = async(req, res) => {
    try {
        const { userName, password } = req.body
        var validate = validateLogin(userName, password)
        if (validate == '') {
            var info = await UserModel.findOne({userName: userName})
            //console.log('userName: ' + info.userName)
            //console.log('info.password: ' + info.password)
            //console.log('info.length: ' + info)
            if (info == null) {
                return res.status(404).json({status: false, errors: ['Usuario no existe']})
            }
            if (!(await bcryptjs.compare(password, info.password))) {
                return res.status(404).json({status: false, errors: ['Contraseña incorrecta']})
            }
            const token = Jwt.sign({id:info._id},JWT_SECRET,{
                expiresIn: JWT_EXPIRES
            })
            const user = {id: info._id, userName: info.userName, token: token}
            return res.status(200).json({status: true, data: user, message: 'Acceso correcto'})
        } else {
            return res.status(400).json({status: false, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, message: [error.message]})
    }
}

const deleteImage = async(id) => {
    const user = await UserModel.findById(id)
    const img = user.image
    fs.unlinkSync('./public/' + img)
}

const validateUsers = (userName, firstName, lastName, phone, email, birthdate, password, image, isvalidate)  => {
    var errors = []
    if (userName === undefined || userName.trim() === '') {
        errors.push('The UserName is mandatory.')
    }
    if (firstName === undefined || firstName.trim() === '') {
        errors.push('The firstName is mandatory.')
    }
    if (lastName === undefined || lastName.trim() === '') {
        errors.push('The firstName is mandatory.')
    }
    if (phone === undefined || phone.trim() === '') {
        errors.push('The Phone is mandatory.')
    }
    if (email === undefined || email.trim() === '') {
        errors.push('The Email is mandatory.')
    }
    if (email === undefined || email.trim() === '') {
        errors.push('The Email is mandatory.')
    }
    if (password === undefined || password.trim() === '') {
        errors.push('The Password is mandatory.')
    }
    if (birthdate === undefined || birthdate.trim() === '' || isNaN(Date.parse(birthdate))) {
        errors.push('The Birthdate is mandatory and formate valide.')
    }
    if (isvalidate === 'Y' && image === undefined) {
        errors.push('Format Image invalidate.')
    } else {
        if (errors != '') {
            fs.unlinkSync('./public/uploads/' + image.file.filename)
        }
    }
    return errors
}

const validateLogin = (userName, password)  => {
    var errors = []
    if (userName === undefined || userName.trim() === '') {
        errors.push('The UserName is mandatory.')
    }
    if (password === undefined || password.trim() === '' || password.length < 8) {
        errors.push('The Password is mandatory.')
    }
    return errors
}