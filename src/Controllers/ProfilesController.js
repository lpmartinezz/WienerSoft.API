import mongoose from "mongoose";
import * as fs from 'fs'
import { stringify } from "querystring";
import Jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { JWT_SECRET, JWT_EXPIRES } from "../config.js";

const profileSchema = mongoose.Schema({
    name: String,
    description: String,
    state: Boolean,
    userCreate: String,
    dateCreate: Date,
    userEdit: String,
    dateEdit: Date
}, {versionKey:false})

const ProfileModel = new mongoose.model('profiles', profileSchema);

export const getProfiles = async(req, res) => {
    try {
        const {id} = req.params
        const rows =
        (id === undefined) ? await ProfileModel.find() : await ProfileModel.findById(id)
        return res.status(200).json({ status: true, data: rows})
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error]})
    }
}

export const saveProfiles = async(req, res) => {
    try {
        const { 
            name, 
            description, 
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateProfiles(name, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newProfiles = new ProfileModel({
                name: name,
                description: description,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newProfiles.save().then(
                () => { res.status(200).json({status: true, message: 'Create Profile'})}
            )
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const updateProfiles = async(req, res) => {
    try {
        const {id} = req.params
        const { name, description, state, userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = { 
            name : name, 
            description : description, 
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateProfiles(name, state, userEdit, fecha)
        if (validate == '') {
            await ProfileModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, message: 'Update Profile'})
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const deleteProfiles = async(req, res) => {
    try {
        const {id} = req.params
        await ProfileModel.deleteOne({_id:id})
        return res.status(200).json({status:true, message: 'Delete Profile'})
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

const validateProfiles = (name, state, userCreate, dateCreate)  => {
    var errors = []
    if (name === undefined || name.trim() === '') {
        errors.push('The Name is mandatory.')
    }
    if (state === undefined || state.trim() === '') {
        errors.push('The State is mandatory.')
    }
    if (userCreate === undefined || userCreate.trim() === '') {
        errors.push('The userCreate is mandatory.')
    }
    if (dateCreate === undefined || dateCreate.trim() === '') {
        errors.push('The DateCreate is mandatory and formate valide.')
    }
    return errors
}