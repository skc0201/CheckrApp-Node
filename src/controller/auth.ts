import { Request , Response, NextFunction } from "express";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import Recruiter from '../models/recruiter';
import { validationResult } from 'express-validator';
import dotenv from 'dotenv';

dotenv.config();

export const addRecruiter = (req: Request, res: Response, next: NextFunction) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const company = req.body.company;
    const phone = req.body.phone;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error('Validation failed.');
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
                message:"Recruiter added successfully" , recruiterId: result._id
            })
        })
    })
    .catch(error => {
        next(error);
    });
}
export const loginRecruiter = (req: Request, res: Response, next: NextFunction) => {
    const email = req.body.email;
    const password = req.body.password;

    const valError = validationResult(req);
    if(!valError.isEmpty()){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data = valError.array();
        throw error;  
      }
      
    let currentUser: any;
    Recruiter
    .findOne({email: email})
    .then(recruiter => {
        if(!recruiter){
            const error = new Error(`A recruiter with this ${email} could not be found.`);
            throw error;
        }
        currentUser = recruiter;
        return bcrypt.compare(password, recruiter.password);
    })
    .then(isEqual => {
        if (!isEqual) {
            const error = new Error('Wrong password!! Please try again.');
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