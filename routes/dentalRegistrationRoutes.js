import express from 'express';
import { register, getAll } from '../controllers/dentalRegistrationController.js';
import upload from '../middlewares/multer.js';

const router = express.Router();

router.post('/', upload.fields([{ name: 'file' }, { name: 'ClinicFile' }]), register);
router.get('/', getAll);

export default router;
