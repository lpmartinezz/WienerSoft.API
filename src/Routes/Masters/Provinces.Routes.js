import { Router } from "express";
import { getProvinces, saveProvinces, updateProvinces, deleteProvinces, getProvincesByIdDepartment } from '../../Controllers/Masters/ProvincesController.js'
import { verify } from "../../Middleware/Masters/Provinces.js";

const rutas = Router()

rutas.get('/api/provinces',verify, getProvinces)
rutas.get('/api/provinces/:id',verify, getProvinces)
rutas.get('/api/provincesbydepartment/:id',verify, getProvincesByIdDepartment)
rutas.post('/api/provinces',verify, saveProvinces)
rutas.put('/api/provinces/:id',verify, updateProvinces)
rutas.delete('/api/provinces/:id',verify, deleteProvinces)

export default rutas