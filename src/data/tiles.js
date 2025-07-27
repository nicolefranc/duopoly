// src/data/tiles.js

// const tiles = [
//     { name: "Start", event: null },
//     { name: "Picnic Memory", event: "Describe our picnic night in 3 words." },
//     { name: "Draw Me", event: "Draw each other from memory in 1 minute." },
//     { name: "Compliment Battle", event: "Take turns giving compliments until someone repeats." },
//     { name: "Flirty Charades", event: "Act out a romantic moment without words." },
//     { name: "Love Letter Race", event: "Write a 30-second love letter. Most heartfelt wins." },
//     { name: "Emoji Gift", event: "Send your partner 5 emojis to describe how you feel now." },
//     { name: "Final Stop", event: "You made it to today. Celebrate with your future plans ❤️" },
//   ];
export const CORNER = "corner"
export const PROPERTY = "property"
export const CHEST = "chest"
export const CHANCE = "chance"
export const UTILITY = "utility"


const tiles = {
  0: { type: CORNER, idx: 0 },
  1: { type: PROPERTY, idx: 0},
  2: { type: CHEST, idx: 0 },
  3: { type: PROPERTY, idx: 1 },
  4: { type: PROPERTY, idx: 2 },

  5: { type: CORNER, idx: 1 },
  6: { type: PROPERTY, idx: 3 },
  7: { type: PROPERTY, idx: 4 },
  8: { type: CHANCE, idx: 0 },
  9: { type: PROPERTY, idx: 5 },
  
  10: { type: CORNER, idx: 2 },
  11: { type: PROPERTY, idx: 6 },
  12: { type: UTILITY, idx: 0 },
  13: { type: PROPERTY, idx: 7 },
  14: { type: PROPERTY, idx: 8 },

  15: { type: CORNER, idx: 3 },
  16: { type: PROPERTY, idx: 9 },
  17: { type: CHEST, idx: 1 },
  18: { type: PROPERTY, idx: 10 },
  19: { type: PROPERTY, idx: 11 }
}
  
export default tiles;
  