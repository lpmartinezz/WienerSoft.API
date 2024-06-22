import { Router } from 'express'
import Jwt, { decode } from 'jsonwebtoken'
import { JWT_SECRET } from '../config.js'

export const verify = Router()

verify.use((req, res, next) => {
    let token = req.headers['x-access-token'] || req.headers['authorization']
    if (!token) {
        return res.status(401).json({status:false, errors: ['No autorizado']})
    }
    if (token.startsWith('Bearer')) {
        token = token.slice(7, token.length)
        Jwt.verify(token, JWT_SECRET, (error, decode) => {
            if(error) {
                return res.status(401).json({status: false, errors: ['Token NO valido']})
            } else {
                req.decode = decode
                next()
            }
        })
    }
})