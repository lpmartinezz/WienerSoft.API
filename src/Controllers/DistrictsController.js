import mongoose from "mongoose";

const districtSchema = mongoose.Schema({
    districtName: String,
    districtCode: String,
    countries: {
        type:mongoose.Types.ObjectId
    },
    departments: {
        type:mongoose.Types.ObjectId
    },
    provinces: {
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

const DistrictModel = new mongoose.model('districts', districtSchema);

export const getDistricts = async(req, res) => {
    try {
        //1- Distrito ----> Pais
        //2- Distrito ----> Departamento
        //3- Distrito ----> Provincia
        let {id} = req.params
        let rows = []
        if (id === undefined) {
            rows = await DistrictModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesDistricts"
                        }
                    }
                    ,{ $unwind: "$countriesDistricts" }
                    ,{
                        $lookup:
                        {
                            from: "departments",
                            localField: "departments",
                            foreignField: "_id",
                            as: "departmentsDistricts"
                        }
                    }
                    ,{ $unwind: "$departmentsDistricts" }
                    ,{
                        $lookup:
                        {
                            from: "provinces",
                            localField: "provinces",
                            foreignField: "_id",
                            as: "provincesDistricts"
                        }
                    }
                    ,{ $unwind: "$provincesDistricts" }
                ]
            )
        } else {
            rows = await DistrictModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesDistricts"
                        }
                    }
                    ,{ $unwind: "$countriesDistricts" }
                    ,{
                        $lookup:
                        {
                            from: "departments",
                            localField: "departments",
                            foreignField: "_id",
                            as: "departmentsDistricts"
                        }
                    }
                    ,{ $unwind: "$departmentsDistricts" }
                    ,{
                        $lookup:
                        {
                            from: "provinces",
                            localField: "provinces",
                            foreignField: "_id",
                            as: "provincesDistricts"
                        }
                    }
                    ,{ $unwind: "$provincesDistricts" }
                    ,{ $match: {$expr: {$eq: ["$_id", {"$toObjectId": id}]}} }
                ]
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: [], message: [error]})
    }
}

export const getDistrictsByIdProvince = async(req, res) => {
    try {
        //1- Provincia ----> Pais
        //2- Provincia ----> Departamento
        //3- Provincia ----> Distrito
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
                            as: "countriesDistricts"
                        }
                    }
                    ,{ $unwind: "$countriesDistricts" }
                    ,{
                        $lookup:
                        {
                            from: "districts",
                            localField: "districtsdepartments",
                            foreignField: "_id",
                            as: "provincesDistricts"
                        }
                    }
                    ,{ $unwind: "$provincesDistricts" }
                ]
            )
        } else {
            rows = await DistrictModel.find(
                {
                    provinces: id
                }
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: [], message: [error]})
    }
}

export const saveDistricts = async(req, res) => {
    try {
        const { 
            districtName,
            districtCode,
            countries,
            departments,
            provinces,
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateDistricts(districtName, districtCode, countries, departments, provinces, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newDistricts = new DistrictModel({
                districtName : districtName,
                districtCode : districtCode,
                countries : countries,
                departments : departments,
                provinces : provinces,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newDistricts.save().then(
                () => { res.status(200).json({status: true, data: newDistricts, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateDistricts = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            districtName,
            districtCode,
            countries,
            departments,
            provinces,
            state, 
            userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = {
            districtName : districtName,
            districtCode : districtCode,
            countries : countries,
            departments : departments,
            provinces : provinces,
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateDistricts(districtName, districtCode, countries, departments, provinces, state, userEdit, fecha)
        if (validate == '') {
            await DistrictModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteDistricts = async(req, res) => {
    try {
        const {id} = req.params
        await DistrictModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateDistricts = (districtName, districtCode, countries, departments, provinces, state, userCreate, dateCreate)  => {
    var errors = []
    if (districtName === undefined || districtName.trim() === '') {
        errors.push('The District Name is mandatory.')
    }
    if (districtCode === undefined || districtCode.trim() === '') {
        errors.push('The Code District is mandatory.')
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