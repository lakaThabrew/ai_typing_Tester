import express from 'express';
import axios from 'axios';

const router = express.Router();

const stagePrompts = {
  easy: 'Generate a simple, short sentence with very common words for typing practice.',
  steady: 'Generate a slightly longer sentence with varied common vocabulary and light punctuation.',
  challenging: 'Generate a medium-length sentence with punctuation, adjectives, and mixed clause structures.',
  advanced: 'Generate a complex sentence with diverse vocabulary, punctuation, and a mix of clauses.',
  expert: 'Generate a challenging paragraph with technical terms, punctuation, and complex structure.',
};

const levelHints = [
  'Keep it very short (8-12 words) and extremely common vocabulary.',
  'Keep it short (10-14 words) and simple punctuation.',
  'Slightly longer (12-16 words) with one comma.',
  'Medium length (14-18 words), add an adjective or two.',
  'Medium length (16-20 words), include a comma-separated clause.',
  'Longer (18-22 words), mix clause structures.',
  'Longer (20-24 words), add varied punctuation like commas and semicolons sparingly.',
  'Complex (22-26 words), include descriptive phrasing and a subordinate clause.',
  'Complex (24-28 words), mix pacing and two punctuation marks.',
  'Challenging (26-32 words), rich vocabulary, two punctuation marks, and smooth flow.',
];

router.post('/generate-pharse', async (req, res) => {
  try {
    const { stage = 'easy', level = 1 } = req.body;
    const normalizedStage = stage.toLowerCase();
    const validStages = Object.keys(stagePrompts);

    if (!validStages.includes(normalizedStage)) {
      return res.status(400).json({ error: 'Invalid stage' });
    }

    const levelNumber = Math.min(Math.max(Number(level) || 1, 1), 10);
    const levelHint = levelHints[levelNumber - 1];

    // scale token budget slightly with level to allow longer outputs at higher levels
    const maxTokens = Math.min(40 + levelNumber * 10, 220);

    console.log(`🤖 Calling Gemini AI - Stage: ${normalizedStage}, Level: ${levelNumber}, Max Tokens: ${maxTokens}`);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.0-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,

      {
        contents: [
          {
            parts: [
              {
                text: `${stagePrompts[normalizedStage]} ${levelHint} Return ONLY the sentence, no quotes or explanations.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.9,
          maxOutputTokens: maxTokens,
          topP: 0.95,
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const phrase = response.data.candidates[0].content.parts[0].text
      .trim()
      .replace(/^['"]|['"]$/g, '');
    console.log(`✅ Gemini AI Response: "${phrase}"`);
    res.json({ phrase, pharse: phrase });
  } catch (error) {
    console.error('❌ Gemini AI API Error:', error.message);
    console.error(error.response?.data || error.message);
    console.log('⚠️  Using fallback phrase...');
    const fallbacks = {
      easy: 'The quick brown fox jumps over the lazy dog.',
      steady: 'Typing every day improves speed and accuracy over time.',
      challenging: 'Practice makes perfect when you type with focus and determination.',
      advanced: 'Technology has revolutionized communication, enabling instant global connectivity.',
      expert:
        'Sophisticated algorithms analyze patterns in user behavior, optimizing performance through machine learning techniques.',
    };

    const fallbackStage = req.body?.stage?.toLowerCase() || 'easy';
    const phrase = fallbacks[fallbackStage] || fallbacks.easy;
    res.json({ phrase, pharse: phrase });
  }
});

export default router;
