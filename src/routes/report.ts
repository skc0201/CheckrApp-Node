import express from 'express';
import { addReport, getAllReports, getReportById, updateReport } from '../controller/report';


const router = express.Router();

router.get('/reports', getAllReports);
router.post('/report/:candidateId', addReport);
router.get('/report/:candidateId', getReportById);
router.put('/report/:candidateId', updateReport);

export default router;
