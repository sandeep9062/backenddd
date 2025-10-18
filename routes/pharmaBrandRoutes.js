import express from 'express';
import * as pharmaBrandController from '../controllers/pharmaBrandController.js';

const router = express.Router();

router.post('/', pharmaBrandController.registerPharmaBrand);
router.get('/', pharmaBrandController.fetchPharmaBrands);

export default router;
