import { Request , Response, NextFunction } from "express"
import CourtSearch from '../models/court-searches';
import { validationResult } from "express-validator";
import { COURT_SEARCH_ADDED, COURT_SEARCH_DELETED, COURT_SEARCH_EXIST, COURT_SEARCH_FOUND, COURT_SEARCH_LIST, COURT_SEARCH_NOT_FOUND, COURT_SEARCH_UPDATED, VALIDATION_FAILED } from "../utils/constant";


export const getAllCourtSearchReport = (req: Request, res: Response, next: NextFunction) => {
    CourtSearch
        .find()
        .populate('candidate')
        .then(reports => {
            res.status(200).json({
                message:COURT_SEARCH_LIST,
                data: reports
            })
        }).catch(error => {
            next(error);
        })
}

export const AddCourtSearchReport = (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.params.candidateId;

    const {ssn_verification , sex_offender , global_watchlist , federal_criminal , country_criminal }  = req.body;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
    CourtSearch
    .findOne({candidate: candidateId})
    .then(result => {
        if(result){
            const error = new Error(COURT_SEARCH_EXIST + candidateId);
            throw error;
        }
        const courtSearchReport = new CourtSearch({
            ssn_verification:ssn_verification,
            sex_offender:sex_offender,
            global_watchlist:global_watchlist,
            federal_criminal:federal_criminal,
            country_criminal:country_criminal,
            candidate:candidateId
        });
       return courtSearchReport.save()
        .then(result => {
            res.status(201).json({
                message:COURT_SEARCH_ADDED , Report: result
            })
        })
    })
    .catch(error => {
        next(error);
    });
}
export const getCourtSearchReportById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    CourtSearch
        .findOne({candidate: id})
        .populate('candidate')
        .then(report => {
            if(!report){
                const error = new Error(COURT_SEARCH_NOT_FOUND + id);
                throw error;
            }
            res.status(200).json({
                message:COURT_SEARCH_FOUND,
                candidates: report
            })
        }).catch(error => {
            next(error);
        })
}

export const deleteCourtSearch = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    CourtSearch.findOne({candidate: id})
    .then(candidate => {
        if (!candidate) {
            const error = new Error(COURT_SEARCH_NOT_FOUND + id);
            throw error;
          }
          return CourtSearch.findByIdAndRemove(candidate._id);
    })
    .then(result =>{
        res.status(200).json({
            message: COURT_SEARCH_DELETED,
        })
    })
    .catch(error => {
            next(error)
     })
}

export const updateCourtSearchById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    const {ssn_verification , sex_offender , global_watchlist , federal_criminal , country_criminal }  = req.body;


    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
    CourtSearch
        .findOne({candidate: id})
        .then(report => {
            if(!report){
                const error = new Error(COURT_SEARCH_NOT_FOUND + id);
                throw error;
            }
            report.ssn_verification = ssn_verification;
            report.sex_offender = sex_offender;
            report.global_watchlist = global_watchlist;
            report.federal_criminal = federal_criminal;
            report.country_criminal = country_criminal;
            return report.save()
        })
        .then(result => {
            res.status(200).json({
                message:COURT_SEARCH_UPDATED,
                data: result
            })
        })
        .catch(error => {
            next(error);
        })
}