import express from 'express';
import { getAllRecruiters, addRecruiter, getRecruiterById, deleteRecruiter } from '../controller/recruiter';


const router = express.Router();

router.get('/users', getAllRecruiters);
router.post('/user', addRecruiter);
router.get('/user/:userId', getRecruiterById);
router.delete('/user/:userId', deleteRecruiter);

export default router;
