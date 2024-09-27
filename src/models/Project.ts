import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import { TaskType } from './Task'
import { IUser } from './User'

//Document -> Hereda todo el tipado de document
export type ProjectType = Document & {
    projectName: string,
    clientName: string,
    description: string,
    tasks: PopulatedDoc<TaskType & Document>[],
    manager: PopulatedDoc<IUser & Document>,
    team: PopulatedDoc<IUser & Document>[]
}

// Definir el modelo para mongoose
const ProjectSchema: Schema = new Schema({
    projectName: {
        type: String,
        required: true,
        trim: true
    },
    clientName: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    tasks: [
        {
            type: Types.ObjectId,
            ref: 'Task'
        }
    ],
    manager: {
        type: Types.ObjectId,
        ref: 'User'
    },
    team: [
        {
            type: Types.ObjectId,
            ref: 'User'
        }
    ]
}, {timestamps: true}) // Agregar la fecha cuando creo y modifico

// registrar schema en mongoose
const Project = mongoose.model<ProjectType>('Project', ProjectSchema)

export default Project;