import mongoose from "mongoose";

const storeSchema = mongoose.Schema({
    storeCode: String,
    storeName: String,
    storeDescription: String,
    storeAddress: String,
    storePhone: String,
    storeType: {
        type:mongoose.Types.ObjectId
    },
    storeAbility: Number,
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

const StoreModel = new mongoose.model('stores', storeSchema);

export const getStores = async(req, res) => {
    try {
        //1- Tipo ----> Almacén
        let {id} = req.params
        let rows = []
        if (id === undefined) {
            rows = await StoreModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "masters",
                            localField: "storeType",
                            foreignField: "_id",
                            as: "mastersStoreTypeStore"
                        }
                    }
                    ,{ $unwind: "$mastersStoreTypeStore" }
                ]
            )
        } else {
            rows = await StoreModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "masters",
                            localField: "storeType",
                            foreignField: "_id",
                            as: "mastersStoreTypeStore"
                        }
                    }
                    ,{ $unwind: "$mastersStoreTypeStore" }
                    ,{$match: {$expr: {$eq: ["$_id", {"$toObjectId": id}]}}}
                ]
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: [], message: [error]})
    }
}

export const saveStores = async(req, res) => {
    try {
        const { 
            storeCode, 
            storeName,
            storeDescription,
            storeAddress,
            storePhone,
            storeType,
            storeAbility,
            state, 
            userCreate
        } = req.body
        let fecha = new Date().toISOString();
        const validate = validateStores(storeCode, storeName, storeDescription, storeType, storeAbility, state, userCreate, fecha)
        if (validate == '') {
            let fecha = new Date();
            const newStories = new StoreModel({
                storeCode: storeCode,
                storeName: storeName,
                storeDescription: storeDescription,
                storeAddress: storeAddress,
                storePhone: storePhone,
                storeType: storeType,
                storeAbility: storeAbility,
                state: state,
                userCreate: userCreate,
                dateCreate: fecha
            })
            return await newStories.save().then(
                () => { res.status(200).json({status: true, data: newStories, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateStores = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            storeCode, 
            storeName,
            storeDescription,
            storeAddress,
            storePhone,
            storeType, 
            storeAbility,
            state, 
            userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = {
            storeCode : storeCode,
            storeName : storeName,
            storeDescription : storeDescription,
            storeAddress: storeAddress,
            storePhone: storePhone,
            storeType: storeType,
            storeAbility: storeAbility,
            state : state,
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateStores(storeCode, storeName, storeDescription, storeType, storeAbility, state, userEdit, fecha)
        if (validate == '') {
            await StoreModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteStores = async(req, res) => {
    try {
        const {id} = req.params
        await StoreModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateStores = (storeCode, storeName, storeDescription, storeType, storeAbility, state, userCreate, dateCreate)  => {
    var errors = []
    if (storeCode === undefined || storeCode.trim() === '') {
        errors.push('The Code Store is mandatory.')
    }
    if (storeName === undefined || storeName.trim() === '') {
        errors.push('The Name Store is mandatory.')
    }
    if (storeDescription === undefined || storeDescription.trim() === '') {
        errors.push('The Description Store is mandatory.')
    }
    if (storeType === undefined || storeType.trim() === '') {
        errors.push('The Type Store is mandatory.')
    }
    if (storeAbility === undefined || storeAbility === 0) {
        errors.push('The Ability Store is mandatory.')
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