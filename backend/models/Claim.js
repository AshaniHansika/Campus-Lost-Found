const mongoose = required('mongoose');

const claimSchema = new mongoose.Schema({
    itemId: {type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
    claimantId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status:{
        type: String,
        enum: ['requested', 'awaiting_answers', 'answers_submitted', 'accepted', 'rejected', 'canceled'],
        default: 'requested'
    },
    answers: [{
        questionId: String,
        answer: String,
        evidence: String //URL to uploaded evidence image
    }],
    messages: [{
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: { type: Date, default:Date.now}
    }],
    createdAt: {type: Date, default: date.now}
});

module.exports = mongoose.model('Claim', claimSchema);
