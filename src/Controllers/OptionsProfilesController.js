import mongoose from "mongoose";

const optionprofileSchema = mongoose.Schema({
    profiles: {
        type:mongoose.Types.ObjectId
    },
    options: {
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
}, {versionKey:false})

const OptionProfileModel = new mongoose.model('optionsprofiles', optionprofileSchema);

export const getOptionsProfiles = async(req, res) => {
    try {
        const {id} = req.params
        const rows =
        (id === undefined) ? await OptionProfileModel.find() : await OptionProfileModel.findById(id)
        return res.status(200).json({ status: true, data: rows})
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error]})
    }
}

export const saveOptionsProfiles = async(req, res) => {
    try {
        const { 
            options, 
            profiles, 
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateOptionsProfiles(options, profiles, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newOptionsProfiles = new OptionProfileModel({
                options: options,
                profiles: profiles,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newOptionsProfiles.save().then(
                () => { res.status(200).json({status: true, message: 'Create Option Profile'})}
            )
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const updateOptionsProfiles = async(req, res) => {
    try {
        const {id} = req.params
        const { options, profiles, state, userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = { 
            options : options, 
            profiles : profiles, 
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateOptionsProfiles(options, profiles, state, userEdit, fecha)
        if (validate == '') {
            await OptionProfileModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, message: 'Update Option Profile'})
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const deleteOptionsProfiles = async(req, res) => {
    try {
        const {id} = req.params
        await OptionProfileModel.deleteOne({_id:id})
        return res.status(200).json({status:true, message: 'Delete Option Profile'})
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

const validateOptionsProfiles = (options, profiles, state, userCreate, dateCreate)  => {
    var errors = []
    if (options === undefined || options.trim() === '') {
        errors.push('The Options is mandatory.')
    }
    if (profiles === undefined || profiles.trim() === '') {
        errors.push('The Profiles is mandatory.')
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