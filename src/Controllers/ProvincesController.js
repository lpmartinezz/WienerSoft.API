import mongoose from "mongoose";

const provinceSchema = mongoose.Schema({
    provinceName: String,
    provinceCode: String,
    countries: {
        type:mongoose.Types.ObjectId
    },
    departments: {
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

const ProvinceModel = new mongoose.model('provinces', provinceSchema);

export const getProvinces = async(req, res) => {
    try {
        //1- Provincia ----> Pais
        //2- Provincia ----> Departamento
        let {id} = req.params
        let rows = []
        if (id === undefined) {
            rows = await ProvinceModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesProvinces"
                        }
                    }
                    ,{ $unwind: "$countriesProvinces" }
                    ,{
                        $lookup:
                        {
                            from: "departments",
                            localField: "departments",
                            foreignField: "_id",
                            as: "departmentsProvinces"
                        }
                    }
                    ,{ $unwind: "$departmentsProvinces" }
                ]
            )
        } else {
            rows = await ProvinceModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesProvinces"
                        }
                    }
                    ,{ $unwind: "$countriesProvinces" }
                    ,{
                        $lookup:
                        {
                            from: "departments",
                            localField: "departments",
                            foreignField: "_id",
                            as: "departmentsProvinces"
                        }
                    }
                    ,{ $unwind: "$departmentsProvinces" }
                    ,{$match: {$expr: {$eq: ["$_id", {"$toObjectId": id}]}}}
                ]
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: [], message: [error.message] })
    }
}

export const saveProvinces = async(req, res) => {
    try {
        const { 
            provinceName, 
            provinceCode,
            countries,
            departments,
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateProvinces(provinceName, provinceCode, countries, departments, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newProvinces = new ProvinceModel({
                provinceName : provinceName,
                provinceCode : provinceCode,
                countries : countries,
                departments : departments,
                state : state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newProvinces.save().then(
                () => { res.status(200).json({status: true, data: newProvinces, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateProvinces = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            provinceName,
            provinceCode,
            countries,
            departments,
            state, 
            userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = {
            provinceName : provinceName,
            provinceCode : provinceCode,
            countries : countries,
            departments : departments,
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateProvinces(provinceName, provinceCode, countries, departments, state, userEdit, fecha)
        if (validate == '') {
            await ProvinceModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteProvinces = async(req, res) => {
    try {
        const {id} = req.params
        await ProvinceModel.deleteOne({_id:id})
        return res.status(200).json({status: true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateProvinces = (provinceName, provinceCode, countries, departments, state, userCreate, dateCreate)  => {
    var errors = []
    if (provinceName === undefined || provinceName.trim() === '') {
        errors.push('The Province Name is mandatory.')
    }
    if (provinceCode === undefined || provinceCode.trim() === '') {
        errors.push('The Code Province is mandatory.')
    }
    if (countries === undefined || countries.trim() === '') {
        errors.push('The Country is mandatory.')
    }
    if (departments === undefined || departments.trim() === '') {
        errors.push('The Department is mandatory.')
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