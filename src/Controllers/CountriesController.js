import mongoose from "mongoose";

const countrySchema = mongoose.Schema({
    countryName: String,
    countryCode: String,
    countryCodePhone: String,
    countryMoney: String,
    countryMoneyInitials: String,
    countryMoneySymbol: String,
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

const CountryModel = new mongoose.model('countries', countrySchema);

export const getCountries = async(req, res) => {
    try {
        const {id} = req.params
        const rows =
        (id === undefined) ? await CountryModel.find() : await CountryModel.findById(id)
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        console.log(' error ' + error)
        return res.status(500).json({ status: false, data: [], message: [error.message]})
    }
}

export const saveCountries = async(req, res) => {
    try {
        const { 
            countryName, 
            countryCode,
            countryCodePhone,
            countryMoney,
            countryMoneyInitials,
            countryMoneySymbol,
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateCountries(countryName, countryCode, countryCodePhone, countryMoney, countryMoneyInitials, countryMoneySymbol, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newCountries = new CountryModel({
                countryName: countryName,
                countryCode: countryCode,
                countryCodePhone: countryCodePhone,
                countryMoney: countryMoney,
                countryMoneyInitials: countryMoneyInitials,
                countryMoneySymbol: countryMoneySymbol,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newCountries.save().then(
                () => { res.status(200).json({status: true, data: newCountries, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateCountries = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            countryName, 
            countryCode,
            countryCodePhone,
            countryMoney,
            countryMoneyInitials,
            countryMoneySymbol, 
            state, 
            userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = {
            countryName : countryName,
            countryCode : countryCode,
            countryCodePhone : countryCodePhone,
            countryMoney: countryMoney,
            countryMoneyInitials: countryMoneyInitials,
            countryMoneySymbol: countryMoneySymbol,
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateCountries(countryName, countryCode, countryCodePhone, countryMoney, countryMoneyInitials, countryMoneySymbol, state, userEdit, fecha)
        if (validate == '') {
            await CountryModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteCountries = async(req, res) => {
    try {
        const {id} = req.params
        await CountryModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateCountries = (countryName, countryCode, countryCodePhone, countryMoney, countryMoneyInitials, countryMoneySymbol, state, userCreate, dateCreate)  => {
    var errors = []
    if (countryName === undefined || countryName.trim() === '') {
        errors.push('The Name is mandatory.')
    }
    if (countryCode === undefined || countryCode.trim() === '') {
        errors.push('The Code Country is mandatory.')
    }
    if (countryCodePhone === undefined || countryCodePhone.trim() === '') {
        errors.push('The Code Country Phone is mandatory.')
    }
    if (countryMoney === undefined || countryMoney.trim() === '') {
        errors.push('The Code country Money is mandatory.')
    }
    if (countryMoneyInitials === undefined || countryMoneyInitials.trim() === '') {
        errors.push('The Code country Money Initials is mandatory.')
    }
    if (countryMoneySymbol === undefined || countryMoneySymbol.trim() === '') {
        errors.push('The Code country Money Symbol is mandatory.')
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