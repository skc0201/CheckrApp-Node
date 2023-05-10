import express from 'express';
import { getAllRecruiters, addRecruiter, getRecruiterById, deleteRecruiter } from '../controller/recruiter';


const router = express.Router();

router.get('/', getAllRecruiters);
router.post('/', addRecruiter);
router.get('/:userId', getRecruiterById);
router.delete('/:userId', deleteRecruiter);

export default router;
