import mongoose from "mongoose";

const departmentSchema = mongoose.Schema({
    departmentName: String,
    departmentCode: String,
    countries: {
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

const DepartmentModel = new mongoose.model('departments', departmentSchema);

export const getDepartments = async(req, res) => {
    try {
        //1- Departamento ----> Pais
        let {id} = req.params
        let rows = []
        if (id === undefined) {
            rows = await DepartmentModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesDepartments"
                        }
                    }
                    ,{ $unwind: "$countriesDepartments" }
                ]
            )
        } else {
            rows = await DepartmentModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "countries",
                            localField: "countries",
                            foreignField: "_id",
                            as: "countriesDepartments"
                        }
                    }
                    ,{ $unwind: "$countriesDepartments" }
                    ,{$match: {$expr: {$eq: ["$_id", {"$toObjectId": id}]}}}
                ]
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        console.log(error)
        return res.status(500).json({ status: false, data: [], message: [error]})
    }
}

export const saveDepartments = async(req, res) => {
    try {
        const { 
            departmentName, 
            departmentCode,
            countries,
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateDepartments(departmentName, departmentCode, countries, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newDepartments = new DepartmentModel({
                departmentName: departmentName,
                departmentCode: departmentCode,
                countries: countries,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newDepartments.save().then(
                () => { res.status(200).json({status: true, data: newDepartments, message: 'Create Department'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateDepartments = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            departmentName, 
            departmentCode,
            countries,
            state, 
            userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = {
            departmentName : departmentName,
            departmentCode : departmentCode,
            countries : countries,
            state : state, 
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateDepartments(departmentName, departmentCode, countries, state, userEdit, fecha)
        if (validate == '') {
            await DepartmentModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'Update Department'})
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteDepartments = async(req, res) => {
    try {
        const {id} = req.params
        await DepartmentModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateDepartments = (departmentName, departmentCode, countries, state, userCreate, dateCreate)  => {
    var errors = []
    if (departmentName === undefined || departmentName.trim() === '') {
        errors.push('The Name is mandatory.')
    }
    if (departmentCode === undefined || departmentCode.trim() === '') {
        errors.push('The Code Department is mandatory.')
    }
    if (countries === undefined || countries.trim() === '') {
        errors.push('The Country is mandatory.')
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