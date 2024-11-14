import mongoose, {Schema, Document, Types} from 'mongoose'
import Note from './Note';

const taskStatus = {
    PENDING: 'pending',
    ON_HOLD: 'onHold',
    IN_PROGRESS: 'inProgess',
    UNDER_REVIEW: 'underReview',
    COMPLETED: 'completed'
} as const; // De esta manera convierto los valores a reandoly(no se pueden modificar)

// Obtener solo los valores
export type TaskStatus = typeof taskStatus[keyof typeof taskStatus]

export type TaskType = Document & {
    name: string,
    description: string,
    project: Types.ObjectId,
    status: TaskStatus,
    completedBy: {
        user: Types.ObjectId,
        status: TaskStatus
    }[],
    notes: Types.ObjectId[]
}

export const TaskSchema: Schema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    project: { // Relacionar con la tabla Project
        type: Types.ObjectId,
        ref: 'Project'
    },
    status: {
        type: String,
        enum: Object.values(taskStatus), // Indicar que estados puede aceptar el campo status
        default: taskStatus.PENDING
    },
    completedBy: [
        {
            user: {
                type: Types.ObjectId, 
                ref: 'User',
                default: null
            },
            status: {
                type: String,
                enum: Object.values(taskStatus), // Indicar que estados puede aceptar el campo status
                default: taskStatus.PENDING
            }
        }
    ],
    notes: [
        {
            type: Types.ObjectId,
            ref: 'Note'
        }
    ]
}, {timestamps: true}) // Agregar la fecha cuando creo y modifico

// Middleware en moongosse
TaskSchema.pre('deleteOne', {document: true, query: false}, async function () {
    const taskId = this._id;
    if (!taskId) return;
    await Note.deleteMany({task: taskId});
})

const Task = mongoose.model<TaskType>('Task', TaskSchema);

export default Task;