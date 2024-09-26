import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import User, { IUser } from "../models/User";

declare global { // Agregar campo project al type de Request
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
    const bearer = req.headers.authorization;
    if (!bearer) {
        const error = new Error("No Autorizado")
        return res.status(401).send({error: error.message});
    }

    const [, token] = bearer.split(' ');
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (typeof decoded === 'object' && decoded.id) {
            const user = await User.findById(decoded.id).select('_id name email');
            if (user) {
                req.user = user; // Lo almaceno en el request para poder utilizarlo en los controladores
            } else {
                return res.status(500).send({error: "Token No Válido"});
            }
        }
    } catch (error) {
        return res.status(500).send({error: "Token No Válido"});
    }

    next();   
}