import { Router } from "express";
import { getProfiles, saveProfiles, updateProfiles, deleteProfiles } from '../../Controllers/Securities/ProfilesController.js'
import { verify } from "../../Middleware/Securities/Profiles.js";

const rutas = Router()

rutas.get('/api/profiles',verify, getProfiles)
rutas.get('/api/profiles/:id',verify, getProfiles)
rutas.post('/api/profiles',verify, saveProfiles)
rutas.put('/api/profiles/:id',verify, updateProfiles)
rutas.delete('/api/profiles/:id',verify, deleteProfiles)

export default rutas