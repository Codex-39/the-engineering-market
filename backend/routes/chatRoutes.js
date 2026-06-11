import express from 'express';
import {
  sendMessage,
  getConversations,
  getMessages,
} from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect); // protect all chat routes

router.route('/')
  .post(sendMessage);

router.route('/conversations')
  .get(getConversations);

router.route('/messages/:conversationId')
  .get(getMessages);

export default router;
