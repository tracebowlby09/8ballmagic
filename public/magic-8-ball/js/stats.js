/**
 * Statistics Module
 *
 * Tracks detailed statistics about the user's Magic 8 Ball sessions.
 * Uses localStorage to persist between visits.
 */

import { RARITY_LABELS } from '../data/responses.js';

const STORAGE_KEY = 'magic8ball_stats';

export class StatsManager {
  constructor() {
    this.stats = this.#load();
  }

  #load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return this.#getDefaultStats();
  }

  #getDefaultStats() {
    return {
      totalQuestions: 0,
      rarityCounts: {
        common: 0,
        uncommon: 0,
        rare: 0,
        epic: 0,
        legendary: 0,
      },
      responseCounts: {}, // { "It is certain.": 5, ... }
      currentStreakNoRare: 0,
      longestStreakNoRare: 0,
      firstLegendaryTimestamp: null,
      favorites: [], // array of response texts
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  #save() {
    this.stats.updatedAt = new Date().toISOString();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.warn('Could not save statistics to localStorage.');
    }
  }

  /**
   * Record a new question and response.
   */
  recordResponse(response) {
    this.stats.totalQuestions += 1;

    if (response.rarity && this.stats.rarityCounts[response.rarity] !== undefined) {
      this.stats.rarityCounts[response.rarity] += 1;
    }

    // Track individual response frequency
    const text = response.text;
    this.stats.responseCounts[text] = (this.stats.responseCounts[text] || 0) + 1;

    // Track legendary first encounter
    if (response.rarity === 'legendary' && !this.stats.firstLegendaryTimestamp) {
      this.stats.firstLegendaryTimestamp = new Date().toISOString();
    }

    // Track streak without rare
    if (response.rarity === 'rare') {
      this.stats.currentStreakNoRare = 0;
    } else {
      this.stats.currentStreakNoRare += 1;
      if (this.stats.currentStreakNoRare > this.stats.longestStreakNoRare) {
        this.stats.longestStreakNoRare = this.stats.currentStreakNoRare;
      }
    }

    // Add to favorites (simple heuristic: rarely seen responses become favorites)
    if (this.stats.responseCounts[text] <= 2) {
      if (!this.stats.favorites.includes(text)) {
        this.stats.favorites.push(text);
        if (this.stats.favorites.length > 20) {
          this.stats.favorites.shift();
        }
      }
    }

    this.#save();
  }

  /**
   * Returns all statistics needed for the stats view.
   */
  getSummary() {
    const total = this.stats.totalQuestions || 0;
    const rarityCounts = this.stats.rarityCounts || {};
    const responseCounts = this.stats.responseCounts || {};

    // Percentages
    const rarityPercentages = {};
    for (const [rarity, count] of Object.entries(rarityCounts)) {
      rarityPercentages[rarity] = total > 0 ? ((count / total) * 100).toFixed(1) : 0;
    }

    // Rarest response (lowest count, then first seen)
    let rarestResponse = null;
    let rarestCount = Infinity;
    for (const [text, count] of Object.entries(responseCounts)) {
      if (count < rarestCount) {
        rarestCount = count;
        rarestResponse = text;
      }
    }

    // Most common response
    let mostCommonResponse = null;
    let mostCommonCount = 0;
    for (const [text, count] of Object.entries(responseCounts)) {
      if (count > mostCommonCount) {
        mostCommonCount = count;
        mostCommonResponse = text;
      }
    }

    return {
      totalQuestions: total,
      rarityCounts,
      rarityPercentages,
      rarestResponse,
      rarestCount,
      mostCommonResponse,
      mostCommonCount,
      currentStreakNoRare: this.stats.currentStreakNoRare || 0,
      longestStreakNoRare: this.stats.longestStreakNoRare || 0,
      favorites: this.stats.favorites || [],
    };
  }

  /**
   * Clear all statistics.
   */
  clear() {
    this.stats = this.#getDefaultStats();
    this.#save();
  }

  /**
   * Reset everything including timestamps.
   */
  fullReset() {
    this.stats = this.#getDefaultStats();
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const statsManager = new StatsManager();
export default statsManager;
