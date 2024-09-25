import mongoose, { Schema, Document, Types } from "mongoose";

export interface IToken extends Document {
    token: string
    user: Types.ObjectId
    createdAt: Date
}

const tokenSchema : Schema = new Schema({
    token:  {
        type: String,
        required: true
    },
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now(),
        expires: "10m" //10 minutos, cada que se genera un token se elimina despues del tiempo indicado en este caso 10 minutos
    }
})

const token = mongoose.model<IToken>('Token', tokenSchema)
export default token