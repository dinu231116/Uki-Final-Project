import express from 'express';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/serviceController.js';

const router = express.Router();

// GET all services
router.get('/', getAllServices);

// GET one service by ID
router.get('/:id', getServiceById);

// POST new service
router.post('/', createService);

// PUT update service
router.put('/:id', updateService);

// DELETE service
router.delete('/:id', deleteService);

export default router;

