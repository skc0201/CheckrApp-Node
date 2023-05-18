import { Request , Response, NextFunction } from "express";
import Recruiter from '../models/recruiter';
import { RECRUITER_DELETED, RECRUITER_FOUND, RECRUITER_LIST, RECRUITER_NOT_FOUND_MSSG } from "../utils/constant";


export const getAllRecruiters = (req: Request, res: Response, next: NextFunction) => {
    Recruiter
        .find()
        .then(recruiters => {
            res.status(200).json({
                message:RECRUITER_LIST,
                recruiters: recruiters
            })
        }).catch(error => {
            next(error);
        })
}

export const getRecruiterById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    Recruiter
        .findById(id)
        .then(recruiter => {
            if(!recruiter){
                const error = new Error(RECRUITER_NOT_FOUND_MSSG + id);
                throw error;
            }
            res.status(200).json({
                message:RECRUITER_FOUND,
                candidates: recruiter
            })
        }).catch(error => {
            next(error);
        })
}

export const  deleteRecruiter = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    Recruiter.findById(id)
    .then(recruiter => {
        if (!recruiter) {
            const error = new Error(RECRUITER_NOT_FOUND_MSSG + id);
            throw error;
          }
          return Recruiter.findByIdAndRemove(id);
    })
    .then(result =>{
        res.status(200).json({
            message:RECRUITER_DELETED,
        })
    })
    .catch(error => {
            next(error)
     })
}
