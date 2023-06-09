import express from 'express';
import { getAllAdverseReport, AddAdverse } from '../controller/adverse';


const router = express.Router();

router.get('/', getAllAdverseReport);
router.post('/:candidateId', AddAdverse);

export default router;
