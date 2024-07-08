import mongoose from "mongoose";

const optionSchema = mongoose.Schema({
    optionName: String,
    optionURL: String,
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

const OptionModel = new mongoose.model('options', optionSchema);

export const getOptions = async(req, res) => {
    try {
        const {id} = req.params
        const rows =
        (id === undefined) ? await OptionModel.find() : await OptionModel.findById(id)
        return res.status(200).json({ status: true, data: rows})
    } catch (error) {
        return res.status(500).json({ status: false, errors: [error]})
    }
}

export const saveOptions = async(req, res) => {
    try {
        const { 
            optionName, 
            optionURL,
            description, 
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateOptions(optionName, optionURL, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newOptions = new OptionModel({
                optionName: optionName,
                optionURL: optionURL,
                description: description,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newOptions.save().then(
                () => { res.status(200).json({status: true, message: 'Create Option'})}
            )
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const updateOptions = async(req, res) => {
    try {
        const {id} = req.params
        const { optionName, optionURL, description, state, userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = { 
            optionName : optionName, 
            optionURL : optionURL,
            description : description, 
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateOptions(optionName, optionURL, state, userEdit, fecha)
        if (validate == '') {
            await OptionModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, message: 'Update Option'})
        } else {
            return res.status(400).json({status: false, errors: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

export const deleteOptions = async(req, res) => {
    try {
        const {id} = req.params
        await OptionModel.deleteOne({_id:id})
        return res.status(200).json({status:true, message: 'Delete Option'})
    } catch (error) {
        return res.status(500).json({status: false, errors: [error.message]})
    }
}

const validateOptions = (optionName, optionURL, state, userCreate, dateCreate)  => {
    var errors = []
    if (optionName === undefined || optionName.trim() === '') {
        errors.push('The Name is mandatory.')
    }
    if (optionURL === undefined || optionURL.trim() === '') {
        errors.push('The URL is mandatory.')
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