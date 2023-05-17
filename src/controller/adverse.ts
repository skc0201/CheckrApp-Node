import { Request , Response, NextFunction } from "express"
import Adverse from '../models/adverse-action';
import { validationResult } from "express-validator";


export const getAllAdverseReport = (req: Request, res: Response, next: NextFunction) => {
    Adverse
        .find()
        .populate('candidate')
        .then(adverse => {
            res.status(200).json({
                message:"Adverse action list fetched Successfully",
                data: adverse
            })
        }).catch(error => {
            next(error);
        })
}

export const AddAdverse = (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.params.candidateId;
    const status = req.body.status;
    const name = req.body.name;
    const pre_notice_date = req.body.pre_notice_date;
    const post_notice_date = req.body.post_notice_date;
    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
    Adverse
    .find({candidate: candidateId})
    .then(result => {
        if(result[0]){
            const error = new Error('Adverse action already exists for candidate id ' + candidateId);
            throw error;
        }
        const adverse = new Adverse({
            name:name,
            status:status,
            pre_notice_date:pre_notice_date,
            post_notice_date:post_notice_date,
            candidate:candidateId
        });
        return adverse.save()
        .then(result => {
            res.status(201).json({
                message:"Candidate adverse Report added successfully" , Report: result
            })
        })
    })
    .catch(error => {
        next(error);
    });
}