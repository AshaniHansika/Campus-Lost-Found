const reportSchema = new mongoose.Schema({
    itemId: { type: mongoose.Schema.Types,ObjectId, ref: 'Item' },
    reporterId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    reason: String,
    status: {type: String, enum: ['pending', 'reviewed','resolved'], default: 'pending'},
    createdAt: {type: Date, default: Date.now}

});