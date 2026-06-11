import Notification from '../models/Notification.js';
import User from '../models/User.js';

// GET /api/notifications - list notifications for logged-in user
export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .populate('senderId', 'name email')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notifications/read-all - mark all as read
export const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ userId: req.user._id, isRead: false }, { isRead: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error marking all notifications read:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notifications/read/:id - mark single notification read
export const markReadById = async (req, res) => {
  const { id } = req.params;
  try {
    const notif = await Notification.findOneAndUpdate({ _id: id, userId: req.user._id }, { isRead: true }, { new: true });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (error) {
    console.error('Error marking notification read:', error);
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/notifications/read-by-sender/:senderId - mark all notifications from a specific sender as read (used when opening chat)
export const markReadBySender = async (req, res) => {
  const { senderId } = req.params;
  try {
    await Notification.updateMany({ userId: req.user._id, senderId, isRead: false }, { isRead: true });
    res.json({ message: 'Notifications from sender marked as read' });
  } catch (error) {
    console.error('Error marking notifications by sender read:', error);
    res.status(500).json({ message: error.message });
  }
};
