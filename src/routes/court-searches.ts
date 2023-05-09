import express from 'express';
import { getAllCourtSearchReport, AddCourtSearchReport, getCourtSearchReportById, deleteCourtSearch, updateCourtSearchById } from '../controller/court-search';


const router = express.Router();

router.get('/courtsearch', getAllCourtSearchReport);
router.post('/courtsearch/:candidateId', AddCourtSearchReport);
router.get('/courtsearch/:candidateId', getCourtSearchReportById);
router.put('/courtsearch/:candidateId', updateCourtSearchById);
router.delete('/courtsearch/:candidateId', deleteCourtSearch);

export default router;
