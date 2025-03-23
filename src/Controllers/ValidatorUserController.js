import mongoose from "mongoose";
import * as fs from 'fs'
import Jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { JWT_SECRET, JWT_EXPIRES } from "../config.js";
const nodemailer = require('nodemailer')

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

export const sendCodeToEmail = async(req, res) => { 
    try {
        const {emailSend} = req.params;
        //obtener datos usuario por email
        let rows = []
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
                ,{$match: {$expr: {$eq: ["$email", {"$toObjectId": emailSend}]}}}
            ]
        )

        if (rows.length == 0) {
            return res.status(400).json({ status: false, data: [], message: 'Email no existe'})
        } else {
            const result = await transportert.sendMail({ 
                from: `WienerSoft ${process.env.EMAIL}`,
                to: emailSend,
                subject: "Recuperar contraseña",
                body: "Hola, el código generado es: ",
            });
            console.log(result);
            return res.status(200).json({ status: true, data: rows, message: 'OK'})
        }
    } catch (error) {
        console.error('Error: ' + error);
        return res.status(500).json({ status: false, data: rows, message: [error.message]})
    }
}