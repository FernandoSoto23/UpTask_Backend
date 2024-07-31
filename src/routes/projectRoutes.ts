import { Router } from "express";
import { body,param } from "express-validator";
import { ProjectController } from "../controllers/ProjectController";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists } from "../middleware/project";
import { hasAuthorization, taskBelongsToProject, taskExists } from "../middleware/task";
import { authenticate } from "../middleware/auth";
import { TeamMemberController } from "../controllers/TeamController";
import { NoteController } from "../controllers/NoteController";

const router = Router();
router.use(authenticate)
router.post("/",
    body("projectName")
        .notEmpty().withMessage("El nombre del proyecto es Obligatorio"),
    body("clientName")
    .notEmpty().withMessage("El nombre del cliente es Obligatorio"),
    body("description")
    .notEmpty().withMessage("La descripcion del proyecto es Obligatorio"),
    handleInputErrors,
    ProjectController.createProjects
);
router.get("/", ProjectController.getAllProjects);
router.get("/:id",
    param("id").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    ProjectController.getProjectById
);
/* Routes For Task */
router.param("projectId",projectExists,);
router.put("/:projectId",
    param("id").isMongoId().withMessage("ID no valido"),
    body("projectName")
    .notEmpty().withMessage("El nombre del proyecto es Obligatorio"),
    body("clientName")
    .notEmpty().withMessage("El nombre del cliente es Obligatorio"),
    body("description")
    .notEmpty().withMessage("La descripcion del proyecto es Obligatorio"),
    handleInputErrors,
    hasAuthorization,
    ProjectController.updateProject
);

router.delete("/:projectId",
    param("projectId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    hasAuthorization,
    ProjectController.deleteProject
);


router.post("/:projectId/tasks",
    hasAuthorization,
    body("name")
    .notEmpty().withMessage("El nombre de la tarea es Obligatorio"),
    body("description")
    .notEmpty().withMessage("La descripcion de la tarea es Obligatorio"),
    handleInputErrors,
    TaskController.createTask
);

router.get("/:projectId/tasks",
    TaskController.getProjectTasks
);
router.param("taskId",taskExists);
router.param("taskId",taskBelongsToProject);

router.get("/:projectId/tasks/:taskId",
    param("taskId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    TaskController.getTaskById
);
router.put("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId").isMongoId().withMessage("ID no valido"),
    body("name")
    .notEmpty().withMessage("El nombre de la tarea es Obligatorio"),
    body("description")
    .notEmpty().withMessage("La descripcion de la tarea es Obligatorio"),
    handleInputErrors,
    TaskController.updateTask
);

router.delete("/:projectId/tasks/:taskId",
    hasAuthorization,
    param("taskId").isMongoId().withMessage("ID no valido"),
    handleInputErrors,
    TaskController.deleteTask
);

router.post("/:projectId/tasks/:taskId/status",
    param("taskId").isMongoId().withMessage("ID no valido"),
    body("status")
        .notEmpty().withMessage("El estado es obligatorio"),
    handleInputErrors,
    TaskController.updateStatus
)
/* Routes for teams */
router.post("/:projectId/team/find",
    body("email")
        .isEmail().toLowerCase().withMessage("E-mail no valido"),
        handleInputErrors,
        TeamMemberController.findMemberByEmail

);
router.get("/:projectId/team",
    TeamMemberController.getProjectTeam
);
router.post("/:projectId/team",
    body("id")
        .isMongoId().withMessage("ID No valido"),
    handleInputErrors,
    TeamMemberController.addMemberById
);

router.delete("/:projectId/team/:userId",
    param("userId")
        .isMongoId().withMessage("ID No valido"),
    handleInputErrors,
    TeamMemberController.removeMemberById
)

/* Routes for Notes */

router.post("/:projectId/tasks/:taskId/notes",
    body("content")
        .notEmpty().withMessage("El contenido de la nota es obligatoria"),
    handleInputErrors,
    NoteController.createNote
    
);
router.get("/:projectId/tasks/:taskId/notes",
    NoteController.getTaskNotes
    
);

router.delete("/:projectId/tasks/:taskId/notes/:noteId",
    param("noteId").isMongoId().withMessage("ID no Valido"),
    NoteController.deleteNote
)
export default router