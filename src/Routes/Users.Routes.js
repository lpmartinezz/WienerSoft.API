import { Router } from "express";
import  { getUsers, saveUsers, updateUsers, deleteUsers, loginUsers, changePassword, activeUsers } from '../Controllers/UsersController.js'
import { upImage } from '../Middleware/Storage.js';
import { verify } from "../Middleware/Users.js";

const rutas = Router()

rutas.get('/api/users',verify, getUsers)
rutas.get('/api/users/:id',verify, getUsers)
rutas.post('/api/users',verify, upImage.single('image'), saveUsers)
rutas.put('/api/users/:id',verify, upImage.single('image'), updateUsers)
rutas.delete('/api/users/:id',verify, deleteUsers)
rutas.post('/api/login', loginUsers)
rutas.post('/api/user/changePassword',verify, changePassword)
rutas.put('/api/activeUsers/:id',verify, activeUsers)

export default rutas