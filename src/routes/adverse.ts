import express from 'express';
import { getAllAdverseReport, AddAdverse } from '../controller/adverse';
import { validateAdverse } from '../middleware/validation';


const router = express.Router();

router.get('/', getAllAdverseReport);
router.post('/:candidateId', validateAdverse , AddAdverse);

export default router;
