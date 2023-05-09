import express from 'express';
import { getAllAdverseReport, AddAdverse } from '../controller/adverse';


const router = express.Router();

router.get('/adverse', getAllAdverseReport);
router.post('/adverse/:candidateId', AddAdverse);

export default router;
