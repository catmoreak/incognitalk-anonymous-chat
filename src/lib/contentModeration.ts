
const PERSPECTIVE_API_URL = `https://commentanalyzer.googleapis.com/v1alpha1/comments:analyze?key=${import.meta.env.VITE_PERSPECTIVE_API_KEY}`;


interface PerspectiveResponse {
  attributeScores: {
    TOXICITY: {
      summaryScore: {
        value: number;
      };
    };
    SEVERE_TOXICITY: {
      summaryScore: {
        value: number;
      };
    };
    IDENTITY_ATTACK: {
      summaryScore: {
        value: number;
      };
    };
    PROFANITY: {
      summaryScore: {
        value: number;
      };
    };
  };
}

export async function moderateContent(text: string): Promise<boolean> {
  try {
    const response = await fetch(PERSPECTIVE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        comment: { text },
        languages: ['en'],
        requestedAttributes: { 
          TOXICITY: {}, 
          SEVERE_TOXICITY: {}, 
          IDENTITY_ATTACK: {}, 
          PROFANITY: {} 
        },
      }),
    });

    if (!response.ok) {
      console.error('Moderation API error:', await response.text());
      return false; // Allow message if API fails
    }

    const data = await response.json() as PerspectiveResponse;
    
    // Check if any of the scores are above threshold (0.7)
    const toxicityScore = data.attributeScores.TOXICITY?.summaryScore.value || 0;
    const severeToxicityScore = data.attributeScores.SEVERE_TOXICITY?.summaryScore.value || 0;
    const identityAttackScore = data.attributeScores.IDENTITY_ATTACK?.summaryScore.value || 0;
    const profanityScore = data.attributeScores.PROFANITY?.summaryScore.value || 0;
    
    const threshold = 0.7;
    const isInappropriate = 
      toxicityScore > threshold || 
      severeToxicityScore > threshold || 
      identityAttackScore > threshold || 
      profanityScore > threshold;
    
    return !isInappropriate; // Return true if content is appropriate (passes moderation)
  } catch (error) {
    console.error('Error moderating content:', error);
    return false; // Allow message if API fails
  }
}
