import express from 'express';
import { addReport, getAllReports, getReportById, updateReport } from '../controller/report';
import { validateReport } from '../middleware/validation';


const router = express.Router();

router.get('/', getAllReports);
router.post('/:candidateId', validateReport ,addReport);
router.get('/:candidateId', getReportById);
router.put('/:candidateId', validateReport ,updateReport);

export default router;
