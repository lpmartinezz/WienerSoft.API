import { Router } from "express";
import  { getUsers, saveUsers, updateUsers, deleteUsers } from '../Controllers/UsersController.js'
import { upImage } from '../Middleware/Storage.js';
const rutas = Router()

rutas.get('/api/users', getUsers)
rutas.get('/api/users/:id', getUsers)
rutas.post('/api/users', upImage.single('image'), saveUsers)
rutas.put('/api/users/:id', upImage.single('image'), updateUsers)
rutas.delete('/api/users/:id', deleteUsers)

export default rutas