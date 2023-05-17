import { Request , Response, NextFunction } from "express"
import Report from '../models/report';
import { validationResult } from "express-validator";


export const getAllReports = (req: Request, res: Response, next: NextFunction) => {
    Report
        .find()
        .populate('candidate')
        .then(reports => {
            res.status(200).json({
                message:"Report of all candidates fetched Successfully",
                candidates: reports
            })
        }).catch(error => {
            next(error);
        })
}

export const addReport = (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.params.candidateId;
    const status = req.body.status;
    const adjudication = req.body.adjudication;
    const completedAt = req.body.completedAt;
    const tat = req.body.tat;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }

    Report
    .find({candidate: candidateId})
    .then(result => {
        if(result[0]){
            const error = new Error('Report already exists for candidate id ' + candidateId);
            throw error;
        }
        const report = new Report({
            status:status,
            adjudication:adjudication,
            completedAt:completedAt,
            tat:tat,
            candidate:candidateId
        });
        return report.save()
        .then(result => {
            res.status(201).json({
                message:"Candidate Report added successfully" , Report: result
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
                const error = new Error('Could not find candidate report with id: ' + id);
                throw error;
            }
            res.status(200).json({
                message:"Candidate report fetched Successfully",
                candidates: report
            })
        }).catch(error => {
            next(error);
        })
}

export const updateReport = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    const status = req.body.status;
    const adjudication = req.body.adjudication;
    const completedAt = req.body.completedAt;
    const tat = req.body.tat;
    
    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }


    Report
        .find({candidate: id})
        .then(report => {
            if(!report[0]){
                const error = new Error('Could not find candidate report with id: ' + id);
                throw error;
            }
            report[0].status = status;
            report[0].adjudication = adjudication;
            report[0].completedAt = completedAt;
            report[0].tat = tat;
            return report[0].save()
        })
        .then(result => {
            res.status(200).json({
                message:"Candidate report updated Successfully",
            })
        })
        .catch(error => {
            next(error);
        })
}