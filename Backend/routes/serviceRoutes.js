import express from 'express';
const router = express.Router();

import {
  getAllServices,
  getServiceById,
  updateService,
  createService,
  deleteService
} from '../controllers/serviceController.js';
import { protect } from '../middleware/authMiddleware.js';
import { adminOnly } from '../middleware/adminMiddleware.js';

router.get('/', getAllServices);
router.get('/:id', getServiceById);
router.post('/', createService);
router.put('/:id', updateService);
router.delete('/:id', deleteService);

export default router;