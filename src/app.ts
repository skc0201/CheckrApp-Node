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

dotenv.config();

const app = express();
app.disable("x-powered-by");

app.use(bodyParser.json());

app.use('/candidate',candidateRoute);
app.use('/report',ReportRoute);
app.use('/user',RecruiterRoute);
app.use('/adverse',AdverseRoute);
app.use('/courtsearch',CourtSearchRoute);

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