import mongoose from "mongoose";

const masterSchema = mongoose.Schema({
    masterCode: String,
    codeField: String,
    codeInternal: String,
    nameField: String,
    valueone: String,
    valuetwo: String,
    valuethree: String,
    valuefour: String,
    order: Number,
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

const MasterModel = new mongoose.model('masters', masterSchema);

export const getMasters = async(req, res) => {
    try {
        const {id} = req.params
        const rows =
        (id === undefined) ? await MasterModel.find() : await MasterModel.findById(id)
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: [], message: [error.message]})
    }
}

export const saveMasters = async(req, res) => {
    try {
        const { 
            masterCode, 
            codeField,
            codeInternal,
            nameField,
            valueone,
            valuetwo,
            valuethree,
            valuefour,
            order,
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateMasters(masterCode, codeField, codeInternal, nameField, order, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newMasters = new MasterModel({
                masterCode: masterCode,
                codeField: codeField,
                codeInternal: codeInternal,
                nameField: nameField,
                valueone: valueone,
                valuetwo: valuetwo,
                valuethree: valuethree,
                valuefour: valuefour,
                order: order,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newMasters.save().then(
                () => { res.status(200).json({status: true, data: newMasters, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateMasters = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            masterCode, 
            codeField,
            codeInternal,
            nameField,
            valueone,
            valuetwo,
            valuethree,
            valuefour,
            order,
            state, 
            userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = {
            masterCode : masterCode, 
            codeField : codeField,
            codeInternal : codeInternal,
            nameField : nameField,
            valueone : valueone,
            valuetwo : valuetwo,
            valuethree : valuethree,
            valuefour : valuefour,
            order: order,
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateMasters(masterCode, codeField, codeInternal, nameField, order, state, userEdit, fecha)
        if (validate == '') {
            await MasterModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteMasters = async(req, res) => {
    try {
        const {id} = req.params
        await MasterModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateMasters = (masterCode, codeField, codeInternal, nameField, order, state, userCreate, dateCreate)  => {
    var errors = []
    if (masterCode === undefined || masterCode.trim() === '') {
        errors.push('The Code Master is mandatory.')
    }
    if (codeField === undefined || codeField.trim() === '') {
        errors.push('The Code Field is mandatory.')
    }
    if (codeInternal === undefined || codeInternal.trim() === '') {
        errors.push('The Code Internal is mandatory.')
    }
    if (nameField === undefined || nameField.trim() === '') {
        errors.push('The Name Field Phone is mandatory.')
    }
    if (order === undefined) {
        errors.push('The Order is mandatory.')
    }
    if (state === undefined) {
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