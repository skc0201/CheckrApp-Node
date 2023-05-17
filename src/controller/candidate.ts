import { Request , Response, NextFunction } from "express"
import Adddress from '../models/address';
import Candidate from '../models/candidate';
import  { Types } from "mongoose";
import { validationResult } from "express-validator";


export const getAllCandidates = (req: Request, res: Response, next: NextFunction) => {
    Candidate
        .find()
        .populate('address')
        .then(candidates => {
            res.status(200).json({
                message:"Candidates fetched Successfully",
                candidates: candidates
            })
        }).catch(error => {
            next(error);
        })
}

export const addCandidate = (req: Request, res: Response, next: NextFunction) => {
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const contact = req.body.contact;
    const license = req.body.license;
    const DOB = req.body.DOB;
    const houseNo = req.body.houseNo;
    const streetNo = req.body.streetNo;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error('Validation failed.');
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
            message:"Candidate added successfully" , candidate: candidate
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
                const error = new Error('Could not find candidate with id: ' + id);
                throw error;
            }
            res.status(200).json({
                message:"Candidate fetched Successfully",
                candidates: candidate
            })
        }).catch(error => {
            next(error);
        })
}

export const updateCandidate = (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.candidateId;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const email = req.body.email;
    const contact = req.body.contact;
    const license = req.body.license;
    const DOB = req.body.DOB;
    const houseNo = req.body.houseNo;
    const streetNo = req.body.streetNo;
    const city = req.body.city;
    const state = req.body.state;
    const pincode = req.body.pincode;
    let addId: Types.ObjectId;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
      
    Candidate
        .findById(id)
        .then(candidate => {
            if(!candidate){
                const error = new Error('Could not find candidate with id: ' + id);
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
                const error = new Error('Could not find address of candidate with id: ' + addId);
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
                message:"Candidate details updated Successfully",
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
            const error = new Error('Could not find candidate with id: ' + id);
            throw error;
          }
          addressId = candidate?.address;
          return Candidate.findByIdAndRemove(id);
    }).then(result =>{
        return Adddress.findByIdAndRemove(addressId)
    })
    .then(result =>{
        res.status(200).json({
            message:"Candidate deleted",
        })
    })
    .catch(error => {
            next(error)
     })
}