import type { Request, Response } from 'express'
import Task from '../models/Task';

export class TaskController {

    static createTaks = async (req: Request, res: Response) => {

        try {
            const task = new Task(req.body);
            task.project = req.project.id; // relaciono el id del proyecto a la tarea
            // Agregando tarea al proyecto
            req.project.tasks.push(task.id);
            // await task.save();
            // await req.project.save();
            await Promise.allSettled([task.save(), req.project.save()]) // Garantiza que todas las promesas se ejecuten
            // await Project.create(req.body)
            res.send('Tarea creada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }

    }

    static getProjectTask = async (req: Request, res: Response) => {
        try {
            // populate -> obtiene la información del documento relacionado
            const tasks = await Task.find({project: req.project.id}).populate('project')
            res.json(tasks)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static getTaskById = async (req: Request, res: Response) => {
        try {
            res.json(req.task)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateTaskById = async (req: Request, res: Response) => {
        try {
            req.task.name = req.body.name;
            req.task.description = req.body.description;
            await req.task.save()

            res.send('Tarea actualizada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static deleteTask = async (req: Request, res: Response) => {
        try {
            req.project.tasks = req.project.tasks.filter( task => task._id.toString() !== req.task.id.toString() )
            await Promise.allSettled([req.task.deleteOne(), req.project.save()])

            res.send('Tarea eliminada correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static updateStatus = async (req: Request, res: Response) => {
        try {
            const { status } = req.body;
            req.task.status = status;
            await req.task.save();
            res.send('Tarea actualizada correctamente')

        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

}