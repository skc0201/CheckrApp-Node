const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
import dotenv from 'dotenv';
import {Request , Response, NextFunction } from 'express';
import candidateRoute from './routes/candidate';
import ReportRoute from './routes/report';
import RecruiterRoute from './routes/recruiter';
import AdverseRoute from './routes/adverse';
import CourtSearchRoute from './routes/court-searches';
import { errorResponse } from './utils/error';

dotenv.config();

const app = express();

app.use(bodyParser.json());

app.use(candidateRoute);
app.use(ReportRoute);
app.use(RecruiterRoute);
app.use(AdverseRoute);
app.use(CourtSearchRoute);

app.use((request: Request, response : Response, next : NextFunction) => {
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader(
		'Access-Control-Allow-Methods',
		'OPTIONS, GET, POST, PUT, PATCH, DELETE'
	);
	response.setHeader(
		'Access-Control-Allow-Headers',
		'Content-Type, Authorization'
	);
	next();
});


app.use(errorResponse);

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log('Connected to Checkr-App DB!!!!');
    app.listen(process.env.PORT, () => {
        console.log('Server is running at port : ' + process.env.PORT)
    });
  })
  .catch((err: any) => {
    console.log(err);
  });