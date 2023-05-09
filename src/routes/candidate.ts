import express from 'express';

import {getAllCandidates , addCandidate, deleteCandidate, updateCandidate, getCandidateById} from '../controller/candidate';

const router = express.Router();

router.get('/candidates', getAllCandidates);
router.post('/candidate', addCandidate);
router.get('/candidate/:candidateId', getCandidateById);
router.put('/candidate/:candidateId', updateCandidate);
router.delete('/candidate/:candidateId', deleteCandidate);

export default router;
