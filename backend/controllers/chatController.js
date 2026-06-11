import Message from '../models/Message.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Send a message (start or continue chat)
// @route   POST /api/chats
// @access  Private
export const sendMessage = async (req, res) => {
  const { receiverId, listingId, content, image } = req.body;
  const senderId = req.user._id;

  if (!receiverId) {
    return res.status(400).json({ message: 'Receiver ID is required' });
  }

  // Create a unique conversation ID sorted alphabetically
  const conversationId = [senderId.toString(), receiverId.toString()].sort().join('-');

  try {
    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      listing: listingId || undefined,
      content,
      image,
      conversationId,
    });

    // Create notification for receiver
    await Notification.create({
      userId: receiverId,
      senderId: senderId,
      type: 'message',
      message: content || 'Sent an image',
      isRead: false,
    });

    const populatedMsg = await Message.findById(message._id)
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('listing', 'title price image');

    res.status(201).json(populatedMsg);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all conversations (active chats) for the current user
// @route   GET /api/chats/conversations
// @access  Private
export const getConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all messages involving user, sorted by newest first
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }],
    })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('listing', 'title price image')
      .sort({ createdAt: -1 });

    // Deduplicate to find last message of each conversation thread
    const conversations = [];
    const seenConversations = new Set();

    for (const msg of messages) {
      if (!seenConversations.has(msg.conversationId)) {
        seenConversations.add(msg.conversationId);

        // Identify other participant
        const otherUser =
          msg.sender._id.toString() === userId.toString() ? msg.receiver : msg.sender;

        // Ensure otherUser exists (fallback in case user deleted)
        if (otherUser) {
          conversations.push({
            conversationId: msg.conversationId,
            lastMessage: msg,
            otherUser: {
              _id: otherUser._id,
              name: otherUser.name,
              email: otherUser.email,
            },
            listing: msg.listing || null,
          });
        }
      }
    }

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages in a specific conversation thread
// @route   GET /api/chats/messages/:conversationId
// @access  Private
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id.toString();

    // Verify user belongs in this conversation
    const parts = conversationId.split('-');
    if (!parts.includes(userId)) {
      return res.status(401).json({ message: 'Not authorized to access this conversation' });
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'name email')
      .populate('receiver', 'name email')
      .populate('listing', 'title price image')
      .sort({ createdAt: 1 }); // chronological order

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
