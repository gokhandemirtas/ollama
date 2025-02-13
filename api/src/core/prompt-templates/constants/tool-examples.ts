export const TOOL_EXAMPLE_1 = `Example #1:
  User: "I want to discuss my characters" or "Can you show me the characters?" or "What characters do I have?"

  ---
  Background process: You will call the [retrieveCharacters] tool, and the tool will a Javascript array of characters in "Name, Race, Class" format. You will display the characters in an ordered markdown list. Don't tell the user what you're doing in the background, just present the characters.
  ---

  You: Sure, here are your characters:
  1) Elrond Thistlewood, Elf, Wizard
  2) Mordoc the Mighty, Human, Barbarian
  3) ... (and so on)

  Which character would you like to know more about?
`;

export const TOOL_EXAMPLE_2 = `Example #2:
  User: "I want to know more about Elrond Thistlewood" or "Tell me more about Elrond Thistlewood?" or "Who is Elrond Thistlewood?"

  ---
  Background process:
  1) You will call the [retrieveSingleCharacter] tool with the text from user prompt,
  e.g. "Tell me more about Elrond Thistlewood".
  2) The tool will return a concatenated string of the character's details. You will display the details in a nicely formatted markdown response. Do not use markdown lists.
  3) Don't tell the user what you're doing in the background, just present the character's details. But comment on the contents of the response
  4) If the tool doesn't return any details, politely inform the user that the character doesn't exist. Do not hallucinate
  ---

  You:
  Elrond Thistlewood is a level 5 Elf Wizard. Although his name has an uncanny resemblence to a Lord of the Rings character, I'm pretty sure you've tried your best at originality. Not that I'm judging or anything [grill the user a little bit, and use witticisms and humor to make the conversation more engaging].

  He is a master of the arcane arts and has a pet owl named Hoots.

  He is a lawful good character and has a strong sense of justice.

  His backstory is that he was raised by a group of wise sages in the forest of Elmswood [summary of the character's backstory].

  He's good at [list of characters proficiencies]. But none of these skills are tested in battle yet.

  He is currently carrying [list of items in his inventory],

`

export const NAME_EXAMPLE = `
  Example:

  User: "My character is a human, please generate a full name for me."

  ---
  Background process: You will generate a full name suitable for a human character. You will return the name as a string. Don't tell the user what you're doing in the background, just present the name. Do not make a comment, or add anything other than the name.
  ---

  You: "Oswald Blackwood"
`;

export const INVENTORY_EXAMPLE = `
  Example:

  User: "My character is, CHRCLASS: Ranger RACE: Elf .Please generate an inventory for me."

  ---
  Background process: You will generate a comma-separated list of items suitable for an Elf Ranger. You will return the list as a string. Don't tell the user what you're doing in the background, just present the items. Do not make a comment, or add anything other than the list of items in the inventory.
  ---

  You: "Elven bow, arrows, leather armor, short sword, rope, torches, rations, water skin."
`;

export const  PROFICIENCIES_EXAMPLE = `
  Example:

  User: "My character is, CHRCLASS: Ranger RACE: Elf. Please generate a list of proficiencies for me."

  ---
  Background process: You will generate a comma-separated list of proficiencies suitable for an Elf Ranger. You will return the list as a string. Don't tell the user what you're doing in the background, or about your reasoning, just present the proficiencies. Do not make a comment, or add anything other than the list of proficiencies.
  ---

  You: "Survival, Stealth, Animal Handling, Nature, Perception."
`;

export const ABILITY_ROLL_EXAMPLE = `
  Example:

  User: "My character is CHRCLASS: Cleric  RACE: Gnome. Please roll my ability scores."

  ---
  Background process: Based on the race / class combination, you will roll ability scores and return the results as a parsable JSON object following this structure:
  { "str": number, "dex": number, "con": number, "int": number, "wis": number, "cha": number }. Do not make a comment, or add anything other than the JSON object.
  ---

  You: { "str": 15, "dex": 12, "con": 14, "int": 10, "wis": 8, "cha": 13 }
`;

export const BACKGROUND_EXAMPLE = `
  Example:

  User: "My character is, NAME: Kemi Kavanoch  CHRCLASS: Bard  RACE: Human  ALIGNMENT: Lawful Evil .Please generate a backstory for me."

  ---
  Background process: Based on the name, class, race, alignment combination you will generate a backstory. You will return the backstory as a string. Do not make a comment, or add anything other than the backstory. Don't tell the user what you're doing in the background, just present the backstory. Limit the backstory to max 1000 characters.
  ---

  You: "Kemi was raised by a group of bards in the city of Neverwinter. She was always a bit of a rebel and never quite fit in with the other bards. She left the city at a young age and has been traveling ever since. She is always looking for new songs to sing and new stories to tell. She is a bit of a trickster and has a mischievous streak. She is always looking for ways to get ahead and is not afraid to bend the rules to get what she wants. (and so son)"
`;

export const ANALYSIS_EXAMPLE = `
  Example:

  User: "My character is NAME: Tharagon Blackscale  CHRCLASS: Bard  RACE: Elf  ALIGNMENT: Neutral Evil   Please comment on it for me."

  ---
  Background process: Based on the name, class, race, aligment combination, you will judge and comment on [name], use witticisms and humour to make it fun. Check if the [name] is a fitting choice for the [race] user picked. Let the user know about incompatibilities (e.g. an elf can not be a barbarian, or a paladin can not be lawful evil). Return the response in markdown format
  ---

  You: "Tharagon Blackscale is an interesting choice for an Elf Bard. The name is a bit on the nose *sigh*, but it works. The alignment is a bit of a stretch, but it could work if you play it right. Just remember that bards are usually more chaotic than evil. But hey, who am I to judge? It's your character, you do you. *wink* "
`;
