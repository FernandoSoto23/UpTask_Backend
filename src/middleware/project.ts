import type { Request,Response, NextFunction } from "express";
import Project, { IProject } from "../models/Project";

declare global {
    namespace Express{
        interface Request {
            project : IProject
        }
    }
}
export async function projectExists( req: Request, res: Response,next: NextFunction){
    try {
        const { projectId } = req.params;
        const project = await Project.findById(projectId);
        if(!project){
            const error = new Error("Proyecto no encontrado")
            return res.status(400).json({error: error.message});
        }  
        req.project = project
        next();     
    } catch (error) {
        res.status(500).json({error:"hubo un error"});
    }
}