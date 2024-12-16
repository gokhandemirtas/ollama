export const nerdyLoadingTexts = [
  "Rolling for initiative...",
  "Summoning the ancient wizards...",
  "Mixing potions and elixirs...",
  "Casting a spell of patience...",
  "Consulting the Dungeon Master...",
  "Gathering the party...",
  "Deciphering ancient runes...",
  "Sharpening swords and axes...",
  "Preparing the spellbook...",
  "Brewing a cup of magic tea...",
  "Checking the alignment of stars...",
  "Polishing the dragon scales...",
  "Whispering to the spirits...",
  "Drawing a circle of protection...",
  "Enchanting the armor...",
  "Reading the scrolls of wisdom...",
  "Rolling a natural 20...",
  "Summoning a familiar...",
  "Lighting the torches...",
  "Mapping the dungeon...",
  "Consulting the oracle...",
  "Gathering mana crystals...",
  "Invoking the arcane arts...",
  "Preparing the alchemy lab...",
  "Channeling the mystic energies..."
];

let timer: any = null;

function getRandomLoadingText(): string {
  const randomIndex = Math.floor(Math.random() * nerdyLoadingTexts.length);
  return nerdyLoadingTexts[randomIndex];
}

export function displayLoadingText(interval?: number, callback?: (text: string) => void) {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }

  if (interval && callback) {
    callback('Doing some very important stuff...');
    timer = setInterval(() => {
      callback(getRandomLoadingText());
    }, interval);
  }
}
