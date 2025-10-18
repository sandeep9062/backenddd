import express from 'express';
import subscribe from '../controllers/NewsLetterController.js';

const router = express.Router();

router.post('/', subscribe);

export default router;
