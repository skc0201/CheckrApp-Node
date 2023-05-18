import { Request , Response, NextFunction } from "express"
import Report from '../models/report';
import { validationResult } from "express-validator";
import { REPORT_ADDED, REPORT_EXIST, REPORT_FOUND, REPORT_LIST, REPORT_NOT_FOUND, REPORT_UPDATE, VALIDATION_FAILED } from "../utils/constant";


export const getAllReports = (req: Request, res: Response, next: NextFunction) => {
    Report
        .find()
        .populate('candidate')
        .then(reports => {
            res.status(200).json({
                message:REPORT_LIST,
                candidates: reports
            })
        }).catch(error => {
            next(error);
        })
}

export const addReport = (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.params.candidateId;
    const data = req.body ;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }

    Report
    .find({candidate: candidateId})
    .then(result => {
        if(result[0]){
            const error = new Error(REPORT_EXIST + candidateId);
            throw error;
        }
        const report = new Report({
            ...data,
            candidate:candidateId
        });
        return report.save()
        .then(result => {
            res.status(201).json({
                message: REPORT_ADDED , Report: result
            })
        })
    })
    .catch(error => {
        next(error);
    });
}
export const getReportById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    Report
        .find({candidate: id})
        .populate('candidate')
        .then(report => {
            if(!report[0]){
                const error = new Error(REPORT_NOT_FOUND + id);
                throw error;
            }
            res.status(200).json({
                message:REPORT_FOUND,
                candidates: report
            })
        }).catch(error => {
            next(error);
        })
}

export const updateReport = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;

    const {status , adjudication , completedAt , tat} =req.body;
    
    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }


    Report
        .findOneAndUpdate({candidate: id} , {
            status , adjudication , completedAt , tat
        } )
        .then(report => {
            if(!report){
                const error = new Error(REPORT_NOT_FOUND + id);
                throw error;
            }
            res.status(200).json({
                message:REPORT_UPDATE,
            })
        })
        .catch(error => {
            next(error);
        })
}