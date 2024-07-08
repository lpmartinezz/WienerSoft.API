import { Router } from "express";
import  { getProvinces, saveProvinces, updateProvinces, deleteProvinces } from '../Controllers/ProvincesController.js'
import { verify } from "../Middleware/Provinces.js";

const rutas = Router()

rutas.get('/api/provinces',verify, getProvinces)
rutas.get('/api/provinces/:id',verify, getProvinces)
rutas.post('/api/provinces',verify, saveProvinces)
rutas.put('/api/provinces/:id',verify, updateProvinces)
rutas.delete('/api/provinces/:id',verify, deleteProvinces)

export default rutas