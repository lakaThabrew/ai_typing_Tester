import express from 'express';

import User from './models/user.js';
import auth from '../middleware/auth.js';

const router = express.Router();

//submit a typing test
router.post('/submit', auth, async (req, res) => {
    try {
        const { wpm, cpm, accuracy, errors, stage, level, time } = req.body;

        const normalizedStage = (stage || 'easy').toLowerCase();
        const levelNumber = Number(level) || 1;
        const validStages = ['easy', 'steady', 'challenging', 'advanced', 'expert'];
        const stageOrder = { easy: 0, steady: 1, challenging: 2, advanced: 3, expert: 4 };

        if (!validStages.includes(normalizedStage)) {
            return res.status(400).json({ error: 'Invalid stage' });
        }

        if (levelNumber < 1 || levelNumber > 10) {
            return res.status(400).json({ error: 'Level must be between 1 and 10' });
        }

        const user = await User.findById(req.user.userId);

        // Validate user can only test current stage/level or previous ones
        const currentStageIndex = stageOrder[user.currentStage];
        const testStageIndex = stageOrder[normalizedStage];

        if (testStageIndex > currentStageIndex ||
            (testStageIndex === currentStageIndex && levelNumber > user.currentLevel)) {
            return res.status(403).json({
                error: 'You must complete current stage/level first',
                currentStage: user.currentStage,
                currentLevel: user.currentLevel
            });
        }

        user.tests.push({
            wpm,
            cpm,
            accuracy,
            errors,
            stage: normalizedStage,
            level: levelNumber,
            difficulty: `${normalizedStage}-level-${levelNumber}`,
            time,
            date: new Date()
        });

        // Check if user passed the test (90% accuracy and reasonable WPM)
        const minWpmRequired = 20 + (stageOrder[normalizedStage] * 10); // 20, 30, 40, 50, 60
        const passed = accuracy >= 90 && wpm >= minWpmRequired;

        if (passed && normalizedStage === user.currentStage && levelNumber === user.currentLevel) {
            // Advance to next level or stage
            if (user.currentLevel < 10) {
                user.currentLevel += 1;
            } else if (testStageIndex < 4) {
                // Move to next stage
                user.currentStage = validStages[testStageIndex + 1];
                user.currentLevel = 1;
                user.maxStageReached = user.currentStage;
            }
        }

        await user.save();

        res.json({
            message: 'Test submitted successfully',
            tests: user.tests,
            currentStage: user.currentStage,
            currentLevel: user.currentLevel,
            maxStageReached: user.maxStageReached,
            passed,
            advancement: passed && (normalizedStage === user.currentStage && levelNumber === user.currentLevel)
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

//get user stats
router.get('/stats', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

//get leaderboard
router.get('/leaderboard', async (req, res) => {
    try {
        const users = await User.find().select('username tests');
        const leaderboard = users
            .map(user => {
                const tests = user.tests;
                if (tests.length === 0) return null;

                const avgWpm = tests.reduce((sum, t) => sum + t.wpm, 0) / tests.length;
                const bestWpm = Math.max(...tests.map(t => t.wpm));

                return {
                    name: user.username,
                    avgWpm: Math.round(avgWpm),
                    bestWpm,
                    testsCount: tests.length
                };
            })
            .filter(Boolean)
            .sort((a, b) => b.avgWpm - a.avgWpm)
            .slice(0, 10);
        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

export default router;