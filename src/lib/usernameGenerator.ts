

const adjectives = [
  "Anonymous", "Brave", "Covert", "Disguised", "Elusive", 
  "Furtive", "Ghost", "Hidden", "Incognito", "Phantom",
  "Quiet", "Random", "Secret", "Stealth", "Veiled",
  "Masked", "Noble", "Private", "Wild", "Zealous","Hero","Warrior"
];

const nouns = [
  "Agent", "Browser", "Cipher", "Defender", "Explorer",
  "Friend", "Guardian", "Hiker", "Innovator", "Jumper",
  "Knight", "Lurker", "Messenger", "Navigator", "Observer",
  "Protector", "Questor", "Ranger", "Scout", "Traveler","Minic","Rolls"
];

// Generate a random username from the adjectives and nouns
export const generateUsername = (): string => {
  const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${randomAdjective}${randomNoun}`;
};
