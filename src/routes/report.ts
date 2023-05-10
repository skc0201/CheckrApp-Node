import express from 'express';
import { addReport, getAllReports, getReportById, updateReport } from '../controller/report';


const router = express.Router();

router.get('/', getAllReports);
router.post('/:candidateId', addReport);
router.get('/:candidateId', getReportById);
router.put('/:candidateId', updateReport);

export default router;
