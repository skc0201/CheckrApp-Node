import { Request , Response, NextFunction } from "express"
import Adverse from '../models/adverse-action';
import { validationResult } from "express-validator";
import { ADVERSE_LIST_SUCCESS, VALIDATION_FAILED, ADVERSE_ALREADY_EXIST, ADVERSE_ADD } from "../utils/constant";


export const getAllAdverseReport = (req: Request, res: Response, next: NextFunction) => {
    Adverse
        .find()
        .populate('candidate')
        .then(adverse => {
            res.status(200).json({
                message:ADVERSE_LIST_SUCCESS,
                data: adverse
            })
        }).catch(error => {
            next(error);
        })
}

export const AddAdverse = (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.params.candidateId;
    const {status , name , pre_notice_date , post_notice_date} = req.body;
    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
    Adverse
    .findOne({candidate: candidateId})
    .then(result => {
        if(result){
            const error = new Error(ADVERSE_ALREADY_EXIST + candidateId);
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
                message:ADVERSE_ADD , Report: result
            })
        })
    })
    .catch(error => {
        next(error);
    });
}