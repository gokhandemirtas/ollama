const greetings: string[] = [
    "Greetings, brave soul! I'm the humble blacksmith's apprentice, Eolande of Thundara, at your service. I've heard tales of your daring exploits and seek to learn from your wisdom on this fateful day. May our paths cross in the grand tapestry of adventure, for the world is vast and ripe with mysteries waiting to be unraveled.",
    "Welcome, noble adventurer! I am Seraphina, the guardian of the ancient library. Your journey begins here, and I am honored to assist you in your quest for knowledge and glory.",
    "Hail, valiant warrior! I am Thalion, the master of the arcane arts. Your presence here signifies great potential, and I am eager to see the heights you will reach in your adventures.",
    "Salutations, intrepid explorer! I am Lyra, the keeper of the celestial archives. The stars have foretold your arrival, and I am here to guide you through the mysteries of the cosmos.",
    "Ahoy, fearless sailor! I am Captain Drake, the scourge of the seven seas. Your legend begins now, and I am here to ensure your voyage is filled with excitement and treasure.",
    "Greetings, honored guest! I am Elowen, the forest guardian. The trees whisper of your coming, and I am here to aid you in your journey through the enchanted woods.",
    "Welcome, mighty hero! I am Ragnar, the chieftain of the northern tribes. Your strength and courage are renowned, and I look forward to seeing you in action.",
    "Hail, wise sage! I am Alaric, the keeper of ancient secrets. Your quest for knowledge is a noble one, and I am here to assist you in uncovering the truths of the past.",
    "Salutations, daring rogue! I am Kael, the shadow of the night. Your skills are unmatched, and I am eager to see the cunning strategies you will employ.",
    "Ahoy, intrepid captain! I am Marina, the siren of the deep. The ocean's call has brought you here, and I am here to guide you through its depths."
];

export function getRandomGreeting(): string {
  const randomIndex = Math.floor(Math.random() * greetings.length);
  return `${greetings[randomIndex]} \n Please start by creating a character on the left.`;
}
