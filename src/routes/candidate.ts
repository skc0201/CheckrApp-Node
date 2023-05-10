import express from 'express';

import {getAllCandidates , addCandidate, deleteCandidate, updateCandidate, getCandidateById} from '../controller/candidate';

const router = express.Router();

router.get('/All', getAllCandidates);
router.post('', addCandidate);
router.get('/:candidateId', getCandidateById);
router.put('/:candidateId', updateCandidate);
router.delete('/:candidateId', deleteCandidate);

export default router;
