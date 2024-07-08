import { Router } from "express";
import  { getOptionsProfiles, saveOptionsProfiles, updateOptionsProfiles, deleteOptionsProfiles } from '../Controllers/OptionsProfilesController.js'
import { verify } from "../Middleware/OptionsProfiles.js";

const rutas = Router()

rutas.get('/api/optionsprofiles',verify, getOptionsProfiles)
rutas.get('/api/optionsprofiles/:id',verify, getOptionsProfiles)
rutas.post('/api/optionsprofiles',verify, saveOptionsProfiles)
rutas.put('/api/optionsprofiles/:id',verify, updateOptionsProfiles)
rutas.delete('/api/optionsprofiles/:id',verify, deleteOptionsProfiles)

export default rutas