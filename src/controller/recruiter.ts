import { Request , Response, NextFunction } from "express"
import Recruiter from '../models/recruiter';


export const getAllRecruiters = (req: Request, res: Response, next: NextFunction) => {
    Recruiter
        .find()
        .then(recruiters => {
            res.status(200).json({
                message:"All recruiters fetched Successfully",
                recruiters: recruiters
            })
        }).catch(error => {
            next(error);
        })
}

export const addRecruiter = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const company = req.body.company;
    const phone = req.body.phone;

    Recruiter
    .find({email: email})
    .then(result => {
        if(result[0]){
            const error = new Error('Email already exist!!!');
            throw error;
        }
        const recruiter = new Recruiter({
            name: name,
            email: email,
            password: password,
            company:company,
            phone: phone
        });
        recruiter.save()
        .then(result => {
            res.status(201).json({
                message:"Recruiter added successfully" , Report: result
            })
        })
    })
    .catch(error => {
        next(error);
    });
}
export const getRecruiterById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId;
    Recruiter
        .findById(id)
        .then(recruiter => {
            if(!recruiter){
                const error = new Error('Could not find recruiter  with id: ' + id);
                throw error;
            }
            res.status(200).json({
                message:"Recruiter fetched Successfully",
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
            const error = new Error('Could not find recruiter with id: ' + id);
            throw error;
          }
          return Recruiter.findByIdAndRemove(id);
    })
    .then(result =>{
        res.status(200).json({
            message:"Recruiter deleted Successfully",
        })
    })
    .catch(error => {
            next(error)
     })
}
