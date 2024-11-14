import mongoose, {Schema, Document, PopulatedDoc, Types} from 'mongoose'
import Task, { TaskType } from './Task'
import { IUser } from './User'
import Note from './Note'

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

// Middleware en moongosse
ProjectSchema.pre('deleteOne', {document: true, query: false}, async function () {
    const projectId = this._id;
    if (!projectId) return;

    const tasks = await Task.find({ project: projectId });
    for(const task of tasks) {
        await Note.deleteMany({task: task.id});
    }

    await Task.deleteMany({project: projectId});
})

// registrar schema en mongoose
const Project = mongoose.model<ProjectType>('Project', ProjectSchema)

export default Project;