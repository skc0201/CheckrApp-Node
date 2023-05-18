import { Request , Response, NextFunction } from "express"
import Adddress from '../models/address';
import Candidate from '../models/candidate';
import  { Types } from "mongoose";
import { validationResult } from "express-validator";
import { CANDIDATE_ADDED, CANDIDATE_ADDRESS_NOT_FOUND, CANDIDATE_DELETED, CANDIDATE_LIST, CANDIDATE_NOT_FOUND, CANDIDATE_UPDATED, VALIDATION_FAILED } from "../utils/constant";


export const getAllCandidates = (req: Request, res: Response, next: NextFunction) => {
    Candidate
        .find()
        .populate('address')
        .then(candidates => {
            res.status(200).json({
                message:CANDIDATE_LIST,
                candidates: candidates
            })
        }).catch(error => {
            next(error);
        })
}

export const addCandidate = (req: Request, res: Response, next: NextFunction) => {

    const {firstName, lastName ,email ,contact , license , DOB , houseNo,
    streetNo, city, state ,pincode
    } = req.body;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
    const address = new Adddress({
        houseNo:houseNo,
        streetNo:streetNo,
        city:city,
        state:state,
        pincode:pincode
    });
    address.save()
    .then(addressRes => {
        const addId = addressRes._id;
        const candidate = new Candidate({
            firstName:firstName,
            lastName:lastName,
            email:email,
            contact:contact,
            license:license,
            DOB:DOB,
            address:addId,
            recruiter:req.userId
        });
        return candidate.save()
    })
    .then(candidate => {
        res.status(201).json({
            message:CANDIDATE_ADDED , candidate: candidate
        })
    })
    .catch(error => {
        next(error);
    });
}
export const getCandidateById = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    Candidate
        .findById(id)
        .populate('address')
        .then(candidate => {
            if(!candidate){
                const error = new Error(CANDIDATE_NOT_FOUND + id);
                throw error;
            }
            res.status(200).json({
                message:CANDIDATE_LIST,
                candidates: candidate
            })
        }).catch(error => {
            next(error);
        })
}

export const updateCandidate = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    const {firstName, lastName ,email ,contact , license , DOB , houseNo,
        streetNo, city, state ,pincode
        } = req.body;
    let addId: Types.ObjectId;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
      
    Candidate
        .findById(id)
        .then(candidate => {
            if(!candidate){
                const error = new Error(CANDIDATE_NOT_FOUND+ id);
                throw error;
            }
            addId = candidate?.address;
            candidate.firstName = firstName;
            candidate.lastName = lastName;
            candidate.email = email;
            candidate.contact = contact;
            candidate.license = license;
            candidate.DOB = DOB;
            return candidate.save()
        })
        .then(result =>{
            return Adddress.findById(addId)
        })
        .then(address => {
            if(!address){
                const error = new Error(CANDIDATE_ADDRESS_NOT_FOUND + addId);
                throw error;
            }          
             address.houseNo = houseNo;
            address.streetNo = streetNo;
            address.city = city;
            address.state =state;
            address.pincode = pincode

            return address.save();
        })
        .then(result => {
            res.status(200).json({
                message:CANDIDATE_UPDATED,
            })
        })
        .catch(error => {
            next(error);
        })
}
export const deleteCandidate = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    let addressId: Types.ObjectId;
    Candidate.findById(id)
    .then(candidate => {
        if (!candidate) {
            const error = new Error(CANDIDATE_NOT_FOUND + id);
            throw error;
          }
          addressId = candidate?.address;
          return Candidate.findByIdAndRemove(id);
    }).then(result =>{
        return Adddress.findByIdAndRemove(addressId)
    })
    .then(result =>{
        res.status(200).json({
            message: CANDIDATE_DELETED,
        })
    })
    .catch(error => {
            next(error)
     })
}