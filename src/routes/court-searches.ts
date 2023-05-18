import express from 'express';
import { getAllCourtSearchReport, AddCourtSearchReport, getCourtSearchReportById, deleteCourtSearch, updateCourtSearchById } from '../controller/court-search';
import { validateCourtSearch } from '../middleware/validation';


const router = express.Router();

router.get('/', getAllCourtSearchReport);
router.post('/:candidateId', validateCourtSearch, AddCourtSearchReport);
router.get('/:candidateId', getCourtSearchReportById);
router.put('/:candidateId', validateCourtSearch, updateCourtSearchById);
router.delete('/:candidateId', deleteCourtSearch);

export default router;
