import mongoose from "mongoose";
import * as fs from 'fs'
import { stringify } from "querystring";
import Jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { JWT_SECRET, JWT_EXPIRES } from "../config.js";
import { profile } from "console";

const userSchema = new mongoose.Schema({
    userName: String,
    firstName: String,
    lastName: String,
    countries: {
        type:mongoose.Types.ObjectId
    },
    departments: {
        type:mongoose.Types.ObjectId
    },
    provinces: {
        type:mongoose.Types.ObjectId
    },
    districts: {
        type:mongoose.Types.ObjectId
    },
    address: String,
    phone: String,
    birthdate: Date,
    email: String,
    password: String,
    passwordNew: String,
    passwwordNewValidate: String,
    image: String,
    profiles: {
        type:mongoose.Types.ObjectId
    },
    state: Boolean,
    userCreate: {
        type:mongoose.Types.ObjectId
    },
    dateCreate: Date,
    userEdit: {
        type:mongoose.Types.ObjectId
    },
    dateEdit: Date
}, {versionKey:false});

const UserModel = new mongoose.model('users', userSchema);

export const getUsers = async(req, res) => {
    try {
        //1- Usuario ----> Perfiles
        //2- Usuario ----> Pais
        //3- Usuario ----> Departamento
        //4- Usuario ----> Provincia
        //5- Usuario ----> Distrito
        let {id} = req.params
        let rows = []
        if (id === undefined) {
            rows = await UserModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "profiles",
                            localField: "profiles",
                            foreignField: "_id",
                            as: "profilesUsers"
                        }
                    }
                    ,{ $unwind: "$profilesUsers" }
                    ,{
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesUsers"
                        }
                    }
                    ,{ $unwind: "$countriesUsers" }
                    ,{
                        $lookup:
                        {
                            from: "departments",
                            localField: "departments",
                            foreignField: "_id",
                            as: "departmentsUsers"
                        }
                    }
                    ,{ $unwind: "$departmentsUsers" }
                    ,{
                        $lookup:
                        {
                            from: "provinces",
                            localField: "provinces",
                            foreignField: "_id",
                            as: "provincesUsers"
                        }
                    }
                    ,{ $unwind: "$provincesUsers" }
                    ,{
                        $lookup:
                        {
                            from: "districts",
                            localField: "districts",
                            foreignField: "_id",
                            as: "districtsUsers"
                        }
                    }
                    ,{ $unwind: "$districtsUsers" }
                ]
            )
        } else {
            //console.log(id)
            rows = await UserModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "profiles",
                            localField: "profiles",
                            foreignField: "_id",
                            as: "profilesUsers"
                        }
                    }
                    ,{ $unwind: "$profilesUsers" }
                    ,{
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesUsers"
                        }
                    }
                    ,{ $unwind: "$countriesUsers" }
                    ,{
                        $lookup:
                        {
                            from: "departments",
                            localField: "departments",
                            foreignField: "_id",
                            as: "departmentsUsers"
                        }
                    }
                    ,{ $unwind: "$departmentsUsers" }
                    ,{
                        $lookup:
                        {
                            from: "provinces",
                            localField: "provinces",
                            foreignField: "_id",
                            as: "provincesUsers"
                        }
                    }
                    ,{ $unwind: "$provincesUsers" }
                    ,{
                        $lookup:
                        {
                            from: "districts",
                            localField: "districts",
                            foreignField: "_id",
                            as: "districtsUsers"
                        }
                    }
                    ,{ $unwind: "$districtsUsers" }
                    ,{$match: {$expr: {$eq: ["$_id", {"$toObjectId": id}]}}}
                ]
            )
        }
    return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        console.error('Error: ' + error);
        return res.status(500).json({ status: false, data: rows, message: [error.message]})
    }
}

export const saveUsers = async(req, res) => {
    try {
        const { 
            userName, 
            firstName, 
            lastName, 
            countries, 
            departments, 
            provinces, 
            districts, 
            address, 
            phone, 
            email, 
            birthdate, 
            password,
            profiles,
            state,
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateUsers(userName, firstName, lastName, countries, departments, provinces, districts, phone, email, birthdate, password, req.file, 'Y')
        if (validate == '') {

            var validateUser = await UserModel.findOne({userName: userName});
            
            if (validateUser != null) {
                return res.status(404).json({status: false, data: [], message: ['El Usuario ya existe!!!']})
            }

            let fecha = new Date();
            let pass = await bcryptjs.hash(password, 8)

            const newUsers = new UserModel({
                userName: userName,
                firstName: firstName,
                lastName: lastName,
                countries: countries,
                departments: departments,
                provinces: provinces,
                districts: districts,
                address: address,
                phone: phone,
                email: email,
                birthdate: birthdate,
                password: pass,
                image: 'https://github.com/lpmartinezz/WienerSoft.API/tree/master/public/uploads/' + req.file.filename,
                profiles: profiles,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newUsers.save().then(
                () => { res.status(200).json({status: true, data: newUsers, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateUsers = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            userName, 
            firstName, 
            lastName, 
            countries, 
            departments, 
            provinces, 
            districts, 
            address, 
            phone, 
            email, 
            birthdate, 
            password,
            profiles,
            state,
            userEdit
        } = req.body
        let image = ''
        let fecha = new Date().toISOString();
        let values = { 
            userName : userName, 
            firstName : firstName, 
            lastName : lastName, 
            countries : countries, 
            departments : departments, 
            provinces : provinces, 
            districts : districts, 
            address : address, 
            phone : phone, 
            email : email, 
            birthdate : birthdate, 
            password : password,
            profiles : profiles,
            state : state,
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        if (req.file != null) {
            image = 'https://github.com/lpmartinezz/WienerSoft.API/tree/master/public/uploads/' + req.file.filename
            values = { 
                userName : userName, 
                firstName : firstName, 
                lastName : lastName, 
                countries : countries, 
                departments : departments, 
                provinces : provinces, 
                districts : districts, 
                address : address, 
                phone : phone, 
                email : email, 
                birthdate : birthdate, 
                password : password,
                profiles : profiles,
                state : state,
                userEdit : userEdit, 
                dateEdit : fecha, 
                image : image
            }
            await deleteImage(id)
        }
        const validate = validateUsers(userName, firstName, lastName, countries, departments, provinces, districts, phone, email, birthdate, password)
        if (validate == '') {
            await UserModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteUsers = async(req, res) => {
    try {
        const {id} = req.params
        await deleteImage(id)
        await UserModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data:[], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data:[],  message: [error.message]})
    }
}

export const changePassword = async(req, res) => {
    try {
        const { id, userName, password, passwordNew, passwordNewValidate } = req.body;
        var validate = validateChanchePass(userName, password, passwordNew, passwordNewValidate)
        if (validate == '') {
            
            var info = await UserModel.findOne({userName: userName});
            
            if (info == null) {
                return res.status(404).json({status: false, errors: ['Usuario no existe']})
            }
            
            if (!(await bcryptjs.compare(password, info.password))) {
                return res.status(404).json({status: false, errors: ['Contraseña incorrecta']})
            }

            if ((await bcryptjs.compare(passwordNew, info.password))) {
                return res.status(404).json({status: false, errors: ['Contraseña Actual no puede ser igual a Contraseña Nueva']})
            }
            
            let passNew = await bcryptjs.hash(passwordNew, 8)
            info.password = passNew;
            await info.save();

            var infoUser = await UserModel.findOne({userName: userName});
            return res.status(200).json({status: true, data: infoUser, message: 'OK'})
        } else {
            return res.status(400).json({status: false, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, message: [error.message]})
    }
}

export const loginUsers = async(req, res) => {
    try {
        const { userName, password } = req.body
        var validate = validateLogin(userName, password)
        if (validate == '') {
            var info = await UserModel.findOne({userName: userName})
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
    fs.unlinkSync('./public' + img)
}

const validateUsers = (userName, firstName, lastName, countries, departments, provinces, districts, phone, email, birthdate, password, image, isvalidate)  => {
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
    if (countries === undefined || countries.trim() === '') {
        errors.push('The Country is mandatory.')
    }
    if (departments === undefined || departments.trim() === '') {
        errors.push('The Department is mandatory.')
    }
    if (provinces === undefined || provinces.trim() === '') {
        errors.push('The Province is mandatory.')
    }
    if (districts === undefined || districts.trim() === '') {
        errors.push('The District is mandatory.')
    }
    if (phone === undefined || phone.trim() === '') {
        errors.push('The Phone is mandatory.')
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

const validateChanchePass = (userName, password, passwordNew, passwordNewValidate) => {
    var errors = []
    if (userName === undefined || userName.trim() === '') {
        errors.push('The UserName is mandatory.')
    }
    if (password === undefined || password.trim() === '' || password.length < 8) {
        errors.push('The Password is mandatory.')
    }
    if (passwordNew === undefined || passwordNew.trim() === '' || passwordNew.length < 8) {
        errors.push('The Password New is mandatory.')
    }
    if (passwordNewValidate === undefined || passwordNewValidate.trim() === '' || passwordNewValidate.length < 8) {
        errors.push('The Password Validate New is mandatory.')
    }
    if (passwordNewValidate != undefined || passwordNewValidate.trim() != '' || passwordNewValidate.length > 7) {
        if (passwordNew != passwordNewValidate) {
            errors.push('The Password New and Pass Validate is diferent!')
        }
    }
    return errors
}