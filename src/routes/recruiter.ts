import express from 'express';
import { getAllRecruiters, getRecruiterById, deleteRecruiter } from '../controller/recruiter';


const router = express.Router();

router.get('/', getAllRecruiters);
router.get('/:userId', getRecruiterById);
router.delete('/:userId', deleteRecruiter);

export default router;
