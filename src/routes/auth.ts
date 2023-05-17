import express from 'express';
import { addRecruiter, loginRecruiter } from '../controller/auth';
import { validateLogin, validateSignup } from '../middleware/validation';


const router = express.Router();

router.post('/signup', validateSignup, addRecruiter);
router.post('/login', validateLogin ,loginRecruiter);


export default router;
