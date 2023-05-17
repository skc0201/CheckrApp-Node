import express from 'express';
import {getAllCandidates , addCandidate, deleteCandidate, updateCandidate, getCandidateById} from '../controller/candidate';
import { validateCandidate } from '../middleware/validation';
const router = express.Router();

router.get('/',getAllCandidates);
router.post('/', validateCandidate ,addCandidate);
router.get('/:candidateId',getCandidateById);
router.put('/:candidateId',validateCandidate ,updateCandidate);
router.delete('/:candidateId',deleteCandidate);

export default router;
