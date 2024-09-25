import type { Request, Response, NextFunction } from "express";
import Task, { TaskType } from "../models/Task";

declare global { // Agregar campo project al type de Request
    namespace Express {
        interface Request {
            task: TaskType
        }
    }
}

export async function validateTaskExists(req:Request, res: Response, next: NextFunction) {
    try {
        const { taskId } = req.params;
        const task = await Task.findById(taskId)
        if (!task) {
            const error = new Error('Tarea no encontrada')
            return res.status(404).json({error: error.message})
        }
        // Compartir project al controllador
        req.task = task;
        next();
    } catch (error) {
        res.status(500).json({error: 'Hubo un error'})
    }
}

export async function taskBelongsToProject(req:Request, res: Response, next: NextFunction) {
    if (req.task.project.toString() !== req.project.id.toString()) {
        const error = new Error('Acción no valida')
        return res.status(400).json({error: error.message})
    }
    next();
}