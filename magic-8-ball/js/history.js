/**
 * History Module
 *
 * Manages a session history of questions and answers.
 * Uses localStorage so history persists across sessions.
 */

const STORAGE_KEY = 'magic8ball_history';

export class HistoryManager {
  constructor() {
    this.history = this.#load();
  }

  #load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  }

  #save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.history));
    } catch (e) {
      console.warn('Could not save history to localStorage.');
    }
  }

  /**
   * Add a new entry to history.
   *
   * @param {string} question
   * @param {Object} response - The response object from responses.js
   */
  addEntry(question, response) {
    const entry = {
      id: Date.now(),
      question: this.#sanitize(question),
      responseText: response.text,
      rarity: response.rarity,
      color: response.color,
      timestamp: new Date().toISOString(),
    };

    this.history.unshift(entry);

    // Keep history manageable
    if (this.history.length > 200) {
      this.history = this.history.slice(0, 200);
    }

    this.#save();
    return entry;
  }

  /**
   * Get the full history array.
   */
  getAll() {
    return this.history;
  }

  /**
   * Get a limited page of history.
   */
  getPage(page = 1, pageSize = 20) {
    const start = (page - 1) * pageSize;
    return this.history.slice(start, start + pageSize);
  }

  /**
   * Clear all history.
   */
  clear() {
    this.history = [];
    this.#save();
  }

  /**
   * Remove a single entry by id.
   */
  remove(id) {
    this.history = this.history.filter((entry) => entry.id !== id);
    this.#save();
  }

  /**
   * Sanitize text for safe storage and display.
   */
  #sanitize(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

export const historyManager = new HistoryManager();
export default historyManager;
