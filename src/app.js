import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
//import {DB_HOST, DB_NAME, DB_PORT} from './config'
import rutasUsers from './Routes/Users.Routes.js'
import rutasProfiles from './Routes/Profiles.Routes.js'
import rutasOptions from './Routes/Options.Routes.js'
import rutasOptionsProfiles from './Routes/OptionsProfiles.Routes.js'
import rutasCountries from './Routes/Countries.Routes.js'
import rutasDepartments from './Routes/Departments.Routes.js'
import rutaProvinces from './Routes/Provinces.Routes.js'
import rutaDistricts from './Routes/Districts.Routes.js'
import rutaMasters from './Routes/Masters.Routes.js'
import rutaStores from './Routes/Stores.Routes.js'

import { MONGODB_URI } from './config.js'
import { PORT } from './config.js'

//const conexion = "mongodb+srv://WienerSoftUser:Y5AMquw2K6K3m7og@clusterwienersoft.sajmzpl.mongodb.net/wienersoftDB?retryWrites=true&w=majority"
//mongoose.connect(conexion).then()

// mongodb connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas. Port:" + PORT))
  .catch((error) => console.error(error));

// server listening
//app.listen(port, () => console.log("Server listening to", port));

const app = express()
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.use(express.static('public'))
//app.get('/', (req, res) => {res.send('Hola Mundo')})
app.use(rutasUsers)
app.use(rutasProfiles)
app.use(rutasOptions)
app.use(rutasOptionsProfiles)
app.use(rutasCountries)
app.use(rutasDepartments)
app.use(rutaProvinces)
app.use(rutaDistricts)
app.use(rutaMasters)
app.use(rutaStores)

app.use( (req,res) => {
    res.status(400).json({status:false, errors: 'Not found'})
})

export default app