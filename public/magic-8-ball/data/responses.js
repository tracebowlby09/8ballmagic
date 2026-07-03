/**
 * Magic 8 Ball Response Data
 *
 * This file stores every possible response the Magic 8 Ball can give.
 * Add, remove, or modify responses here without touching any logic code.
 *
 * Each response object supports the following fields:
 *   text        (string)    - The response text displayed to the user.
 *   weight      (number)    - Controls frequency. Higher = more common.
 *   rarity      (string)    - Category: common | uncommon | rare | epic | legendary
 *   color       (string)    - Optional hex color for the response text.
 *   sound       (string)    - Optional filename in /audio/ to play on reveal.
 *   special     (string)    - Optional special effect name:
 *                            'gold' | 'rainbow' | 'confetti' | 'screen-shake' | 'mystic'
 *   animation   (string)    - Optional reveal animation override.
 *
 * PROBABILITY NOTES:
 * The randomizer automatically calculates probabilities based on weight values.
 * It does NOT need changes when you add or remove responses.
 *
 * Suggested weights:
 *   Common    -> 50
 *   Uncommon  -> 25
 *   Rare      -> 8
 *   Epic      -> 2
 *   Legendary -> 0.1
 */

export const RARITY_LABELS = {
  common: 'Common',
  uncommon: 'Uncommon',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

export const RARITY_COLORS = {
  common: '#b0b0c8',
  uncommon: '#00d4ff',
  rare: '#a855f7',
  epic: '#ffd700',
  legendary: '#ff6b9d',
};

export const responses = [
  // --------------------------------------------------------------------------
  // Common (weight: 50)
  // --------------------------------------------------------------------------
  {
    text: 'It is certain.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'It is decidedly so.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Without a doubt.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Yes definitely.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'You may rely on it.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'As I see it, yes.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Most likely.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Outlook good.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Yes.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Signs point to yes.',
    weight: 50,
    rarity: 'common',
    color: '#b0b0c8',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },

  // --------------------------------------------------------------------------
  // Uncommon (weight: 25)
  // --------------------------------------------------------------------------
  {
    text: 'Reply hazy, try again.',
    weight: 25,
    rarity: 'uncommon',
    color: '#00d4ff',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Ask again later.',
    weight: 25,
    rarity: 'uncommon',
    color: '#00d4ff',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Better not tell you now.',
    weight: 25,
    rarity: 'uncommon',
    color: '#00d4ff',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Cannot predict now.',
    weight: 25,
    rarity: 'uncommon',
    color: '#00d4ff',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Concentrate and ask again.',
    weight: 25,
    rarity: 'uncommon',
    color: '#00d4ff',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },

  // --------------------------------------------------------------------------
  // Rare (weight: 8)
  // --------------------------------------------------------------------------
  {
    text: "Don't count on it.",
    weight: 8,
    rarity: 'rare',
    color: '#a855f7',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'My reply is no.',
    weight: 8,
    rarity: 'rare',
    color: '#a855f7',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'My sources say no.',
    weight: 8,
    rarity: 'rare',
    color: '#a855f7',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Outlook not so good.',
    weight: 8,
    rarity: 'rare',
    color: '#a855f7',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },
  {
    text: 'Very doubtful.',
    weight: 8,
    rarity: 'rare',
    color: '#a855f7',
    sound: 'click.mp3',
    animation: 'reveal-standard',
  },

  // --------------------------------------------------------------------------
  // Epic (weight: 2)
  // --------------------------------------------------------------------------
  {
    text: 'The stars align against you.',
    weight: 2,
    rarity: 'epic',
    color: '#ffd700',
    sound: 'epic.mp3',
    special: 'gold',
    animation: 'reveal-glow',
  },
  {
    text: 'Fate has other plans.',
    weight: 2,
    rarity: 'epic',
    color: '#ffd700',
    sound: 'epic.mp3',
    special: 'gold',
    animation: 'reveal-glow',
  },
  {
    text: 'You are on the right path.',
    weight: 2,
    rarity: 'epic',
    color: '#ffd700',
    sound: 'epic.mp3',
    special: 'gold',
    animation: 'reveal-glow',
  },

  // --------------------------------------------------------------------------
  // Legendary (weight: 0.1)
  // --------------------------------------------------------------------------
  {
    text: 'You are the magic.',
    weight: 0.1,
    rarity: 'legendary',
    color: '#ffffff',
    sound: 'legendary.mp3',
    special: 'rainbow',
    animation: 'reveal-rainbow',
  },
  {
    text: 'The universe has chosen you.',
    weight: 0.1,
    rarity: 'legendary',
    color: '#ffffff',
    sound: 'legendary.mp3',
    special: 'confetti',
    animation: 'reveal-explosion',
  },
];

export default responses;
