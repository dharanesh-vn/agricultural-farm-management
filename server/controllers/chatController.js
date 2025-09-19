const Message = require('../models/Message');

/**
 * @desc    Get chat history between two users
 * @route   GET /api/chat/:userId
 * @access  Private
 */
const getChatHistory = async (req, res, next) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.userId },
        { sender: req.params.userId, receiver: req.user._id },
      ],
    })
    .populate('sender', 'name')
    .populate('receiver', 'name')
    .sort({ createdAt: 'asc' });
    
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Send a message (and save to DB)
 * @route   POST /api/chat
 * @access  Private
 */
const sendMessage = async (req, res, next) => {
    const { receiver, content } = req.body;

    try {
        const message = new Message({
            sender: req.user._id,
            receiver,
            content,
        });

        const savedMessage = await message.save();
        // The real-time part is handled by Socket.io, but we confirm saving here
        res.status(201).json(savedMessage);
    } catch (error) {
        next(error);
    }
};


module.exports = {
  getChatHistory,
  sendMessage
};