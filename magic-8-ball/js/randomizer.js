/**
 * Randomizer Module
 *
 * Handles weighted random selection of responses.
 * To add new responses, simply modify data/responses.js.
 * This file does NOT need to be changed when responses are added.
 */

import { responses } from '../data/responses.js';

/**
 * Pre-calculate cumulative weight ranges for efficient selection.
 */
const buildWeightTable = () => {
  let cumulative = 0;
  return responses.map((response) => {
    cumulative += response.weight;
    return {
      ...response,
      cumulativeWeight: cumulative,
    };
  });
};

let weightTable = buildWeightTable();
let totalWeight = weightTable.length > 0 ? weightTable[weightTable.length - 1].cumulativeWeight : 0;

/**
 * Refresh the weight table if the responses file is updated at runtime.
 */
export const refreshWeightTable = () => {
  weightTable = buildWeightTable();
  totalWeight = weightTable.length > 0 ? weightTable[weightTable.length - 1].cumulativeWeight : 0;
};

/**
 * Returns the total combined weight of all responses.
 */
export const getTotalWeight = () => totalWeight;

/**
 * Selects a random response based on weighted probabilities.
 *
 * @returns {Object} The selected response object, or null if no responses exist.
 */
export const selectResponse = () => {
  if (weightTable.length === 0 || totalWeight <= 0) {
    return null;
  }

  const randomPoint = Math.random() * totalWeight;

  let selected = weightTable[0];
  for (let i = 0; i < weightTable.length; i++) {
    if (randomPoint <= weightTable[i].cumulativeWeight) {
      selected = weightTable[i];
      break;
    }
  }

  return selected;
};

/**
 * Returns a normalized map of rarity -> probability in percent.
 */
export const getProbabilityMap = () => {
  const map = {};

  for (const response of responses) {
    if (!map[response.rarity]) {
      map[response.rarity] = 0;
    }
    map[response.rarity] += response.weight;
  }

  const probabilities = {};
  for (const [rarity, weight] of Object.entries(map)) {
    probabilities[rarity] = totalWeight > 0 ? (weight / totalWeight) * 100 : 0;
  }
  return probabilities;
};

export default { selectResponse, getTotalWeight, getProbabilityMap, refreshWeightTable };
