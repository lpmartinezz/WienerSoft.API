import { Router } from "express";
import  { getMasters, getMastersByMasterCode, saveMasters, updateMasters, deleteMasters } from '../Controllers/MastersController.js'
import { verify } from "../Middleware/Masters.js";

const rutas = Router()

rutas.get('/api/masters',verify, getMasters)
rutas.get('/api/mastersByMasterCode',verify, getMastersByMasterCode)
rutas.get('/api/masters/:id',verify, getMasters)
rutas.post('/api/masters',verify, saveMasters)
rutas.put('/api/masters/:id',verify, updateMasters)
rutas.delete('/api/masters/:id',verify, deleteMasters)

export default rutas