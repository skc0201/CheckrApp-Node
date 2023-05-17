import { Request , Response, NextFunction } from "express";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Recruiter from '../models/recruiter';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';
import { VALIDATION_FAILED, RECRUITER_ADDED, WRONG_PASSWORD, RECRUITER_NOT_FOUND } from "../utils/constant";

dotenv.config();

export const addRecruiter = (req: Request, res: Response, next: NextFunction) => {

    const {name , email , password , company , phone} = req.body;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }

    bcrypt.hash(password,12)
    .then(hashedPassword => {
        const recruiter = new Recruiter({
            name: name,
            email: email,
            password: hashedPassword,
            company:company,
            phone: phone
        });
        return recruiter.save()
        .then(result => {
            res.status(201).json({
                message:RECRUITER_ADDED , recruiterId: result._id
            })
        })
    })
    .catch(error => {
        next(error);
    });
}
export const loginRecruiter = (req: Request, res: Response, next: NextFunction) => {

    const {email , password} = req.body;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error(VALIDATION_FAILED);
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
      
    let currentUser: any;
    Recruiter
    .findOne({email: email})
    .then(recruiter => {
        if(!recruiter){
            const error = new Error(RECRUITER_NOT_FOUND +email);
            throw error;
        }
        currentUser = recruiter;
        return bcrypt.compare(password, recruiter.password);
    })
    .then(isEqual => {
        if (!isEqual) {
            const error = new Error(WRONG_PASSWORD);
            throw error;
          }
          const token = jwt.sign(
            {
              email: currentUser.email,
              userId: currentUser._id.toString()
            },
            process.env.SECRET_KEY as string,
            { expiresIn: process.env.TOKEN_DURATION }
          );
          res.status(200).json({ token: token, recruiterId: currentUser._id.toString() });
    })
    .catch(error => {
        next(error);
    });
}