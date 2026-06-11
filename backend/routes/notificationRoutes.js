import express from 'express';
import {
  getNotifications,
  markAllRead,
  markReadById,
  markReadBySender,
} from '../controllers/notificationController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/', getNotifications);
router.put('/read-all', markAllRead);
router.put('/read/:id', markReadById);
router.put('/read-by-sender/:senderId', markReadBySender);

export default router;
