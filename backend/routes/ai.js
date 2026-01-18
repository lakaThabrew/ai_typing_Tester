import express from 'express';
import axios from 'axios';

const router = express.Router();

const stagePrompts = {
  easy: `
Generate a simple, short sentence using very common everyday words.
Rules:
- Do NOT use "The quick brown fox jumps over the lazy dog"
- Do NOT use pangrams or famous typing examples
- Create a NEW sentence every time
`,
  steady: `
Generate a short sentence with common vocabulary and light punctuation.
Rules:
- Original sentence only
- No famous quotes or typing examples
`,
  challenging: `
Generate a medium-length sentence with punctuation and adjectives.
Rules:
- Original content only
- Natural, smooth flow
`,
  advanced: `
Generate a complex sentence with diverse vocabulary and mixed clauses.
Rules:
- Original content only
- Avoid reused structures
`,
  expert: `
Generate a challenging paragraph with technical vocabulary and complex structure.
Rules:
- Original and unique content
`,
};

const levelHints = [
  'Keep it very short (8-12 words).',
  'Keep it short (10-14 words).',
  'Slightly longer (12-16 words), one comma.',
  'Medium length (14-18 words), add adjectives.',
  'Medium length (16-20 words), comma-separated clause.',
  'Longer (18-22 words), mixed clauses.',
  'Longer (20-24 words), light punctuation variety.',
  'Complex (22-26 words), subordinate clause.',
  'Complex (24-28 words), two punctuation marks.',
  'Challenging (26-32 words), rich vocabulary.',
];

async function generatePhrase(prompt, maxTokens) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.55, // lower for more complete sentences
        topP: 0.85,
        maxOutputTokens: maxTokens,
      },
    }
  );

  const candidates = response.data.candidates || [];
  if (!candidates.length) return '';

  const parts = candidates[0].content?.parts || [];
  const phrase = parts.map(p => p.text || '').join('').trim();

  // Reject stock sentence or too short output
  if (!phrase || phrase.length < 12 || /quick brown fox/i.test(phrase)) return '';

  return phrase;
}

router.post('/generate-pharse', async (req, res) => {
  try {
    const { stage = 'easy', level = 1 } = req.body;
    const normalizedStage = stage.toLowerCase();

    if (!stagePrompts[normalizedStage]) {
      return res.status(400).json({ error: 'Invalid stage' });
    }

    const levelNumber = Math.min(Math.max(Number(level) || 1, 1), 10);
    const levelHint = levelHints[levelNumber - 1];
    const maxTokens = Math.min(60 + levelNumber * 25, 300); // more tokens for complete sentences
    const variationSeed = Math.floor(Math.random() * 1_000_000);

    const prompt = `
                ${stagePrompts[normalizedStage]}
                Level hint: ${levelHint}
                Variation seed: ${variationSeed}

                Instructions:
                - Generate ONE full, grammatical sentence.
                - Do NOT stop mid-sentence.
                - Do NOT use "The quick brown fox jumps over the lazy dog".
                - Return only the sentence, no quotes or explanations.
                - Use word limitations appropriate for level ${levelNumber}.
                `;

    console.log(`🤖 Gemini 2.5 | Stage: ${normalizedStage} | Level: ${levelNumber}`);

    // Try generating up to 2 times if output is too short
    let phrase = await generatePhrase(prompt, maxTokens);
    console.log(`🔄 Generated Phrase: "${phrase}"`);
    if (!phrase) {
      console.log('⚠️ First attempt too short, retrying...');
      phrase = await generatePhrase(prompt, maxTokens);
    }

    if (!phrase) {
      const fallbacks = {
        easy: 'She types slowly while learning new keyboard skills.',
        steady: 'Daily typing practice improves both speed and accuracy.',
        challenging: 'Focused typing practice builds confidence and muscle memory.',
        advanced: 'Modern software tools help users improve productivity through consistent practice.',
        expert:
          'Advanced systems analyze user input patterns to optimize performance through adaptive learning techniques.',
      };
      phrase = fallbacks[normalizedStage] || fallbacks.easy;
    }

    console.log(`✅ Gemini AI Response: "${phrase}"`);
    res.json({ phrase, pharse: phrase });
  } catch (error) {
    console.error('❌ Gemini AI API Error:', error.message);
    console.error(error.response?.data || error.message);
    
    console.log('⚠️  Using fallback phrase...');

    const fallbacks = {
      easy: 'She types slowly while learning new keyboard skills.',
      steady: 'Daily typing practice improves both speed and accuracy.',
      challenging: 'Focused typing practice builds confidence and muscle memory.',
      advanced: 'Modern software tools help users improve productivity through consistent practice.',
      expert:
        'Advanced systems analyze user input patterns to optimize performance through adaptive learning techniques.',
    };

    const fallbackStage = req.body?.stage?.toLowerCase() || 'easy';
    const phrase = fallbacks[fallbackStage] || fallbacks.easy;

    res.json({ phrase, pharse: phrase });
  }
});

export default router;
