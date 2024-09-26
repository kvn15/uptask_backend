import type { Request, Response } from "express";
import Project from "../models/Project";

export class ProjectController {

    static createProject = async (req: Request, res: Response) => {
        const project = new Project(req.body); // Creamos la instancia de Project
        // Asignar usuario quien creo
        project.manager = req.user.id;
        try {
            await project.save();
            // await Project.create(req.body)
            res.send('Proyecto creado correctamente')
        } catch (error) {
            console.log(error)
        }

    }

    static getAllProjects = async (req: Request, res: Response) => {
        try {
            const projects = await Project.find({
                $or: [// Colocar condiciones
                    {manager: {$in: req.user.id}}
                ]
            }); // Obtener todos los registros
            res.json(projects)
        } catch (error) {
            console.log(error)
        }
    }

    static getProjectById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id).populate('tasks'); // Obtener el registro x id
            if (!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                return res.status(404).json({error: error.message})
            }
            res.json(project)
        } catch (error) {
            console.log(error)
        }
    }

    static updateProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findByIdAndUpdate(id, req.body); // Obtener el registro x id y actualizarlo
            if (!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                return res.status(404).json({error: error.message})
            }
            await project.save(); // Guardar
            res.send('Proyecto actualizado correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static deleteProject = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const project = await Project.findById(id); // Obtener el registro x id 
            if (!project) {
                const error = new Error('Proyecto no encontrado')
                return res.status(404).json({error: error.message})
            }

            if (project.manager.toString() !== req.user.id.toString()) {
                const error = new Error('Acción no válida')
                return res.status(404).json({error: error.message})
            }
            await project.deleteOne(); // Guardar
            res.json("Proyecto Eliminado")
        } catch (error) {
            console.log(error)
        }
    }

}