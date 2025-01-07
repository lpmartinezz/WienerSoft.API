import mongoose from "mongoose";

const profileSchema = mongoose.Schema({
    profileName: String,
    description: String,
    state: Boolean,
    userCreate: {
        type:mongoose.Types.ObjectId
    },
    dateCreate: Date,
    userEdit: {
        type:mongoose.Types.ObjectId
    },
    dateEdit: Date
}, {versionKey:false})

const ProfileModel = new mongoose.model('profiles', profileSchema);

export const getProfiles = async(req, res) => {
    try {
        const {id} = req.params
        const rows =
        (id === undefined) ? await ProfileModel.find() : await ProfileModel.findById(id)
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: [], message: [error.message] })
    }
}

export const saveProfiles = async(req, res) => {
    try {
        const { 
            profileName, 
            description, 
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateProfiles(profileName, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newProfiles = new ProfileModel({
                profileName: profileName,
                description: description,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newProfiles.save().then(
                () => { res.status(200).json({status: true, data: newProfiles, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateProfiles = async(req, res) => {
    try {
        const {id} = req.params
        const { profileName, description, state, userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = { 
            profileName : profileName, 
            description : description, 
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateProfiles(profileName, state, userEdit, fecha)
        if (validate == '') {
            await ProfileModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteProfiles = async(req, res) => {
    try {
        const {id} = req.params
        await ProfileModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateProfiles = (profileName, state, userCreate, dateCreate)  => {
    var errors = []
    if (profileName === undefined || profileName.trim() === '') {
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