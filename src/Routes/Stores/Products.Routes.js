import { Router } from "express";
import  { getProducts, saveProducts, updateProducts, deleteProducts } from '../../Controllers/Stores/ProductsController.js'
import { verify } from "../../Middleware/Stores/Products.js";

const rutas = Router()

rutas.get('/api/products',verify, getProducts)
rutas.get('/api/products/:id',verify, getProducts)
rutas.post('/api/products',verify, saveProducts)
rutas.put('/api/products/:id',verify, updateProducts)
rutas.delete('/api/products/:id',verify, deleteProducts)

export default rutas