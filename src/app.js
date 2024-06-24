import express from 'express'
import morgan from 'morgan'
import cors from 'cors'
import mongoose from 'mongoose'
//import {DB_HOST, DB_NAME, DB_PORT} from './config'
import rutasUsers from './Routes/Users.Routes.js'
import rutasProfiles from './Routes/Profiles.Routes.js'
import rutasOptions from './Routes/Options.Routes.js'
import { MONGODB_URI } from './config.js'

//const conexion = "mongodb+srv://WienerSoftUser:Y5AMquw2K6K3m7og@clusterwienersoft.sajmzpl.mongodb.net/wienersoftDB?retryWrites=true&w=majority"
//mongoose.connect(conexion).then()

// mongodb connection
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB Atlas"))
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

app.use( (req,res) => {
    res.status(400).json({status:false, errors: 'Not found'})
})

export default app