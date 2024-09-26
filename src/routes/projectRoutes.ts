import { Router } from "express"
import { body, param } from "express-validator";;
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { validateProjectExists } from "../middleware/project";
import { taskBelongsToProject, validateTaskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";

const router = Router();

router.use(authenticate); // Indico que las rutas de esta instancia tenga el middleware de autenticacion

router.post('/', 
    // Agregar validaciones
    body('projectName')
        .notEmpty().withMessage("El Nombre del Proyecto es Obligatorio"),
    body('clientName')
        .notEmpty().withMessage("El Nombre del Cliente es Obligatorio"),
    body('description')
        .notEmpty().withMessage("La Descripción del Poryecto es Obligatoria"),
    handleInputErrors, //Middelware para validar
    ProjectController.createProject
)

router.get('/', ProjectController.getAllProjects)

router.get('/:id',
    param('id')
        .isMongoId().withMessage('Id no válido'),
    handleInputErrors, //Middelware para validar
    ProjectController.getProjectById
)

router.put('/:id', 
    // Agregar validaciones
    param('id')
        .isMongoId().withMessage('Id no válido'),
    body('projectName')
        .notEmpty().withMessage("El Nombre del Proyecto es Obligatorio"),
    body('clientName')
        .notEmpty().withMessage("El Nombre del Cliente es Obligatorio"),
    body('description')
        .notEmpty().withMessage("La Descripción del Poryecto es Obligatoria"),
    handleInputErrors, //Middelware para validar
    ProjectController.updateProject
)

router.delete('/:id', 
    param('id')
        .isMongoId().withMessage('Id no válido'),
    handleInputErrors, //Middelware para validar
    ProjectController.deleteProject
)

/* Route for Task */
router.param('projectId', validateProjectExists); // Entodas la url que tengan projectId se ejecutara la validación

router.post('/:projectId/tasks',
    // Agregar validaciones
    body('name')
        .notEmpty().withMessage("El Nombre de la Tarea es Obligatorio"),
    body('description')
        .notEmpty().withMessage("La Descripción de la Tarea es Obligatoria"),
    handleInputErrors, //Middelware para validar
    TaskController.createTaks
)

router.get('/:projectId/tasks',
    TaskController.getProjectTask
);

router.param('taskId', validateTaskExists); // Entodas la url que tengan taskId se ejecutara la validación
router.param('taskId', taskBelongsToProject); // Entodas la url que tengan taskId se ejecutara la validación
router.get('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Id no válido'),
    TaskController.getTaskById
);

router.put('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Id no válido'),
    // Agregar validaciones
    body('name')
        .notEmpty().withMessage("El Nombre de la Tarea es Obligatorio"),
    body('description')
        .notEmpty().withMessage("La Descripción de la Tarea es Obligatoria"),
    handleInputErrors, //Middelware para validar
    TaskController.updateTaskById
);

router.delete('/:projectId/tasks/:taskId',
    param('taskId')
        .isMongoId().withMessage('Id no válido'),
    handleInputErrors, //Middelware para validar
    TaskController.deleteTask
);

router.post('/:projectId/tasks/:taskId/status',
    param('taskId')
        .isMongoId().withMessage('Id no válido'),
    body('status')
        .notEmpty().withMessage("El Estado es Obligatorio"),
    handleInputErrors, //Middelware para validar
    TaskController.updateStatus
)

export default router;