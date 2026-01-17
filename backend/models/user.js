import mongoose from 'mongoose';

const testSchema = new mongoose.Schema({
    wpm: Number,
    cpm: Number,
    accuracy: Number,
    errors: Number,
    stage: {
        type: String,
        enum: ['easy', 'steady', 'challenging', 'advanced', 'expert'],
        default: 'easy'
    },
    level: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    difficulty: String,
    time: Number,
    date: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    currentStage: {
        type: String,
        enum: ['easy', 'steady', 'challenging', 'advanced', 'expert'],
        default: 'easy'
    },
    currentLevel: {
        type: Number,
        min: 1,
        max: 10,
        default: 1
    },
    maxStageReached: {
        type: String,
        enum: ['easy', 'steady', 'challenging', 'advanced', 'expert'],
        default: 'easy'
    },
    tests: [testSchema],
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

export default User;