const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
import dotenv from 'dotenv';
import candidateRoute from './routes/candidate';
import ReportRoute from './routes/report';
import RecruiterRoute from './routes/recruiter';
import AdverseRoute from './routes/adverse';
import CourtSearchRoute from './routes/court-searches';
import { errorResponse } from './utils/error';
import AuthRoute from './routes/auth';
import {authenticate} from './middleware/auth';
import Logger from './utils/logger';
import httpLogger from './middleware/httplogger';

dotenv.config();

export const app = express();
app.disable("x-powered-by");

app.use(httpLogger);
app.use(bodyParser.json());

app.use('/auth',AuthRoute);
app.use('/candidate',authenticate ,candidateRoute);
app.use('/report',authenticate,ReportRoute);
app.use('/user',authenticate,RecruiterRoute);
app.use('/adverse',authenticate,AdverseRoute);
app.use('/courtsearch',authenticate,CourtSearchRoute);

app.use(errorResponse);

mongoose
  .connect(process.env.URL)
  .then(() => {
    Logger.info('Connected to Checkr-App DB!!!!')
    app.listen(process.env.PORT ?? 8080, () => {
      Logger.info('Server is running at port : ' + process.env.PORT)
    });
  })
  .catch((err: any) => {
    console.log(err);
  });