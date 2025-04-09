import mongoose from 'mongoose';

const urlSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    clicks: {
        type: Number,
        default: 0,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Url= mongoose.model('Url', urlSchema);    