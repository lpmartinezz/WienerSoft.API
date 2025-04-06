import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    productName: String,
    productDescription: String,
    productPrice: String,
    productFamily: { //Familia
        type:mongoose.Types.ObjectId
    },
    productSubFamily: { //Sub Familia
        type:mongoose.Types.ObjectId
    },
    productBrand: { //marca
        type:mongoose.Types.ObjectId
    },
    productCategory: { //categoría
        type:mongoose.Types.ObjectId
    },
    productSKU: String,
    productAmount: Number,
    productImage: String,
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

const ProductModel = new mongoose.model('products', productSchema);

export const getProducts = async(req, res) => {
    try {
        //1- Familia ----> Producto
        //2- SubFamilia ----> Producto
        //3- Marca ----> Producto
        //4- Categoría ----> Producto
        let {id} = req.params
        let rows = []
        if (id === undefined) {
            rows = await ProductModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "masters",
                            localField: "productFamily",
                            foreignField: "_id",
                            as: "mastersProductFamily"
                        }
                    }
                    ,{ $unwind: "$mastersProductFamily" }
                    ,{
                        $lookup:
                        {
                            from: "masters",
                            localField: "productSubFamily",
                            foreignField: "_id",
                            as: "mastersProductSubFamily"
                        }
                    }
                    ,{ $unwind: "$mastersProductSubFamily" }
                    ,{
                        $lookup:
                        {
                            from: "masters",
                            localField: "productBrand",
                            foreignField: "_id",
                            as: "mastersProductBrand"
                        }
                    }
                    ,{ $unwind: "$mastersProductBrand" }
                    ,{
                        $lookup:
                        {
                            from: "masters",
                            localField: "productCategory",
                            foreignField: "_id",
                            as: "mastersProductCategory"
                        }
                    }
                    ,{ $unwind: "$mastersProductCategory" }
                ]
            )
        } else {
            rows = await ProductModel.aggregate(
                [
                    {
                        $lookup:
                        {
                            from: "masters",
                            localField: "productFamily",
                            foreignField: "_id",
                            as: "mastersProductFamily"
                        }
                    }
                    ,{ $unwind: "$mastersProductFamily" }
                    ,{
                        $lookup:
                        {
                            from: "masters",
                            localField: "productSubFamily",
                            foreignField: "_id",
                            as: "mastersProductSubFamily"
                        }
                    }
                    ,{ $unwind: "$mastersProductSubFamily" }
                    ,{
                        $lookup:
                        {
                            from: "masters",
                            localField: "productBrand",
                            foreignField: "_id",
                            as: "mastersProductBrand"
                        }
                    }
                    ,{ $unwind: "$mastersProductBrand" }
                    ,{
                        $lookup:
                        {
                            from: "masters",
                            localField: "productCategory",
                            foreignField: "_id",
                            as: "mastersProductCategory"
                        }
                    }
                    ,{ $unwind: "$mastersProductCategory" }
                    ,{$match: {$expr: {$eq: ["$_id", {"$toObjectId": id}]}}}
                ]
            )
        }
        return res.status(200).json({ status: true, data: rows, message: 'OK'})
    } catch (error) {
        return res.status(500).json({ status: false, data: [], message: [error]})
    }
}

export const saveProducts = async(req, res) => {
    try {
        const { 
            productName,
            productDescription,
            productPrice,
            productFamily, //Familia
            productSubFamily, //Sub Familia
            productBrand, //marca
            productCategory, //categoría
            productSKU,
            productAmount,
            productImage,
            state,
            userCreate
        } = req.body
        const validate = validateProducts(productName, productDescription, productPrice, productFamily, productSubFamily, productBrand, productCategory, productSKU, productAmount)
        if (validate == '') {
            let fecha = new Date();
            const newProducts = new ProductModel({
                productName : productName,
                productDescription : productDescription,
                productPrice : productPrice,
                productFamily : productFamily, //Familia
                productSubFamily : productSubFamily, //Sub Familia
                productBrand : productBrand, //marca
                productCategory : productCategory, //categoría
                productSKU : productSKU,
                productAmount : productAmount,
                productImage : productImage,
                state : state,
                userCreate : userCreate,
                dateCreate: fecha
            })
            return await newProducts.save().then(
                () => { res.status(200).json({status: true, data: newProducts, message: 'OK'})}
            )
        } else {
            return res.status(400).json({status: false, data: [], message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const updateProducts = async(req, res) => {
    try {
        const {id} = req.params
        const { 
            productName,
            productDescription,
            productPrice,
            productFamily, //Familia
            productSubFamily, //Sub Familia
            productBrand, //marca
            productCategory, //categoría
            productSKU,
            productAmount,
            productImage,
            state, 
            userEdit } = req.body
        let fecha = new Date().toISOString();
        let values = {
            productName : productName,
            productDescription : productDescription,
            productPrice : productPrice,
            productFamily: productFamily,
            productSubFamily: productSubFamily,
            productBrand: productBrand,
            productCategory: productCategory,
            productSKU: productSKU,
            productAmount: productAmount,
            productImage: productImage,
            state : state,
            userEdit : userEdit, 
            dateEdit : fecha 
        }
        const validate = validateProducts(productName, productDescription, productPrice, productFamily, productSubFamily, productBrand, productCategory, productSKU, productAmount)
        if (validate == '') {
            await ProductModel.updateOne({_id: id}, {$set: values})
            return res.status(200).json({status: true, data: values, message: 'OK'})
        } else {
            return res.status(400).json({status: false, data: values, message: validate})
        }
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

export const deleteProducts = async(req, res) => {
    try {
        const {id} = req.params
        await ProductModel.deleteOne({_id:id})
        return res.status(200).json({status:true, data: [], message: 'OK'})
    } catch (error) {
        return res.status(500).json({status: false, data: [], message: [error.message]})
    }
}

const validateProducts = (productName, productDescription, productPrice, productFamily, productSubFamily, productBrand, productCategory, productSKU, productAmount)  => {
    var errors = []
    if (productName === undefined || productName.trim() === '') {
        errors.push('The Product Name is mandatory.')
    }
    if (productDescription === undefined || productDescription.trim() === '') {
        errors.push('The Product Description is mandatory.')
    }
    if (productPrice === undefined || productPrice.trim() === '') {
        errors.push('The Product Price is mandatory.')
    }
    if (productFamily === undefined || productFamily.trim() === '') {
        errors.push('The Product Family is mandatory.')
    }
    if (productSubFamily === undefined || productSubFamily === 0) {
        errors.push('The Product Sub Family is mandatory.')
    }
    if (productBrand === undefined || productBrand === 0) {
        errors.push('The Product Brand is mandatory.')
    }
    if (productCategory === undefined || productCategory === 0) {
        errors.push('The Product Category  is mandatory.')
    }
    if (productSKU === undefined || productSKU === 0) {
        errors.push('The Product SKU  is mandatory.')
    }
    if (productAmount === undefined || productAmount <= 0) {
        errors.push('The Product Amount  is mandatory.')
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