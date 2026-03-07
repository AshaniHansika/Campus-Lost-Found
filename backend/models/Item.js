const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, enum: ['lost', 'found'], required: true },
  category: { 
    type: String, 
    enum: ['id_card', 'wallet', 'phone', 'keys', 'bag', 'laptop', 'other'],
    required: true 
  },
  location: { type: String, required: true },
  date: { type: Date, required: true },
  images: [String],
  status: { 
    type: String, 
    enum: ['active', 'claimed', 'returned', 'removed'],
    default: 'active' 
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  verificationQuestions: [{
    question: String,
    answer: String, // Hashed for security
    isCustom: Boolean
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Item', itemSchema);