import { Request , Response, NextFunction } from "express"
import CourtSearch from '../models/court-searches';


export const getAllCourtSearchReport = (req: Request, res: Response, next: NextFunction) => {
    CourtSearch
        .find()
        .populate('candidate')
        .then(reports => {
            res.status(200).json({
                message:"Court search report of all candidates fetched Successfully",
                data: reports
            })
        }).catch(error => {
            next(error);
        })
}

export const AddCourtSearchReport = (req: Request, res: Response, next: NextFunction) => {
    const candidateId = req.params.candidateId;
    const ssn_verification = req.body.ssn_verification;
    const sex_offender = req.body.sex_offender;
    const global_watchlist = req.body.global_watchlist;
    const federal_criminal = req.body.federal_criminal;
    const country_criminal = req.body.country_criminal;
    CourtSearch
    .find({candidate: candidateId})
    .then(result => {
        if(result[0]){
            const error = new Error('Report already exists for candidate id ' + candidateId);
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
        courtSearchReport.save()
        .then(result => {
            res.status(201).json({
                message:"Candidate court search Report added successfully" , Report: result
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
        .find({candidate: id})
        .populate('candidate')
        .then(report => {
            if(!report[0]){
                const error = new Error('Could not find candidate report with id: ' + id);
                throw error;
            }
            res.status(200).json({
                message:"Candidate report fetched Successfully",
                candidates: report[0]
            })
        }).catch(error => {
            next(error);
        })
}

export const deleteCourtSearch = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    CourtSearch.find({candidate: id})
    .then(candidate => {
        if (!candidate[0]) {
            const error = new Error('Could not find candidate with id: ' + id);
            throw error;
          }
          return CourtSearch.findByIdAndRemove(candidate[0]._id);
    })
    .then(result =>{
        res.status(200).json({
            message:"Candidate report deleted successfully!!",
        })
    })
    .catch(error => {
            next(error)
     })
}

export const updateCourtSearchById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    const ssn_verification = req.body.ssn_verification;
    const sex_offender = req.body.sex_offender;
    const global_watchlist = req.body.global_watchlist;
    const federal_criminal = req.body.federal_criminal;
    const country_criminal = req.body.country_criminal;

    CourtSearch
        .find({candidate: id})
        .then(report => {
            if(!report[0]){
                const error = new Error('Could not find candidate report with id: ' + id);
                throw error;
            }
            report[0].ssn_verification = ssn_verification;
            report[0].sex_offender = sex_offender;
            report[0].global_watchlist = global_watchlist;
            report[0].federal_criminal = federal_criminal;
            report[0].country_criminal = country_criminal;
            return report[0].save()
        })
        .then(result => {
            res.status(200).json({
                message:"Candidate report updated Successfully",
                data: result
            })
        })
        .catch(error => {
            next(error);
        })
}