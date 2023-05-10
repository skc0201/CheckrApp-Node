import express from 'express';
import { getAllCourtSearchReport, AddCourtSearchReport, getCourtSearchReportById, deleteCourtSearch, updateCourtSearchById } from '../controller/court-search';


const router = express.Router();

router.get('/', getAllCourtSearchReport);
router.post('/:candidateId', AddCourtSearchReport);
router.get('/:candidateId', getCourtSearchReportById);
router.put('/:candidateId', updateCourtSearchById);
router.delete('/:candidateId', deleteCourtSearch);

export default router;
