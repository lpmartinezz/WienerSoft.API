import { Router } from "express";
import  { getDistricts, saveDistricts, updateDistricts, deleteDistricts } from '../Controllers/DistrictsController.js'
import { verify } from "../Middleware/Districts.js";

const rutas = Router()

rutas.get('/api/districts',verify, getDistricts)
rutas.get('/api/districts/:id',verify, getDistricts)
rutas.post('/api/districts',verify, saveDistricts)
rutas.put('/api/districts/:id',verify, updateDistricts)
rutas.delete('/api/districts/:id',verify, deleteDistricts)

export default rutas