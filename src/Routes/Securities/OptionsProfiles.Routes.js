import { Router } from "express";
import { getOptionsProfiles, saveOptionsProfiles, updateOptionsProfiles, deleteOptionsProfiles, getOptionsIdProfile } from '../../Controllers/Securities/OptionsProfilesController.js'
import { verify } from "../../Middleware/Securities/OptionsProfiles.js";

const rutas = Router()

rutas.get('/api/optionsprofiles',verify, getOptionsProfiles)
rutas.get('/api/optionsprofiles/:id',verify, getOptionsProfiles)
rutas.post('/api/optionsprofiles',verify, saveOptionsProfiles)
rutas.put('/api/optionsprofiles/:id',verify, updateOptionsProfiles)
rutas.delete('/api/optionsprofiles/:id',verify, deleteOptionsProfiles)
rutas.get('/api/optionsidprofile/:id',verify, getOptionsIdProfile)

export default rutas