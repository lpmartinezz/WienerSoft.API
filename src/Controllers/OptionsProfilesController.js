import mongoose from "mongoose";
mongoose.set('debug', true);

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
        let {id} = req.params
        console.log('menssage', id);
        let rows = []
        if (id === undefined) {
            rows = await OptionProfileModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "profiles",
                            localField: "profiles",
                            foreignField: "_id",
                            as: "profilesOptionsProfiles"
                        }
                    }
                    ,{ $unwind: "$profilesOptionsProfiles" }
                    ,{
                        $lookup:
                        {
                            from: "options",
                            localField: "options",
                            foreignField: "_id",
                            as: "optionsOptionsProfiles"
                        }
                    }
                    ,{ $unwind: "$optionsOptionsProfiles" }
                ]
            )
        } else {
            rows = await OptionProfileModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "profiles",
                            localField: "profiles",
                            foreignField: "_id",
                            as: "profilesOptionsProfiles"
                        }
                    }
                    ,{ $unwind: "$profilesOptionsProfiles" }
                    ,{
                        $lookup:
                        {
                            from: "options",
                            localField: "options",
                            foreignField: "_id",
                            as: "optionsOptionsProfiles"
                        }
                    }
                    ,{ $unwind: "$optionsOptionsProfiles" }
                    ,{$match: {$expr: {$eq: ["$_id", {"$toObjectId": id}]}}}
                ]
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: rows, message: [error.message] })
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
                () => { res.status(200).json({status: true, data: newOptionsProfiles, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
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
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteOptionsProfiles = async(req, res) => {
    try {
        const {id} = req.params
        await OptionProfileModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const getOptionsIdProfile = async(req, res) => {
    try {
        let {id} = req.params
        //console.log('menssage', id);
        let rows = []
        if (id === undefined) {
            rows = await OptionProfileModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "options",
                            localField: "options",
                            foreignField: "_id",
                            as: "options"
                        }
                    }
                    ,{ $unwind: "$options" }
                ]
            )
        } else {
            rows = await OptionProfileModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "options",
                            localField: "options",
                            foreignField: "_id",
                            as: "options"
                        }
                    }
                    ,{ $unwind: "$options" }
                    ,{$match: {$expr: {$eq: ["$profiles", {"$toObjectId": id}]}}}
                ]
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: rows, message: [error.message] })
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