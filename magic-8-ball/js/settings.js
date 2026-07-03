/**
 * Settings Module
 *
 * Manages user preferences and persists them to localStorage.
 * Emits events when settings change so other modules can react.
 */

const STORAGE_KEY = 'magic8ball_settings';

export const DEFAULT_SETTINGS = {
  soundEnabled: true,
  animationsEnabled: true,
  autoClearInput: false,
  theme: 'dark', // 'dark' | 'light' | 'system'
};

export class SettingsManager {
  constructor() {
    this.listeners = new Set();
    this.settings = this.#load();
    this.#applyTheme();
  }

  #load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return { ...DEFAULT_SETTINGS, ...parsed };
      }
    } catch (e) {
      // ignore
    }
    return { ...DEFAULT_SETTINGS };
  }

  #save() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.settings));
    } catch (e) {
      console.warn('Could not save settings to localStorage.');
    }
  }

  /**
   * Subscribe to setting changes.
   *
   * @param {Function} listener
   * @returns {Function} Unsubscribe function
   */
  onChange(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  #notify() {
    for (const listener of this.listeners) {
      listener(this.settings);
    }
  }

  /**
   * Get a setting by key.
   */
  get(key) {
    return this.settings[key];
  }

  /**
   * Set one or more settings and persist.
   *
   * @param {Object} updates
   */
  set(updates) {
    let changed = false;
    for (const [key, value] of Object.entries(updates)) {
      if (this.settings[key] !== value) {
        this.settings[key] = value;
        changed = true;
      }
    }

    if (changed) {
      this.#save();
      if (updates.theme) {
        this.#applyTheme();
      }
      this.#notify();
    }
  }

  /**
   * Reset all settings to defaults.
   */
  reset() {
    this.settings = { ...DEFAULT_SETTINGS };
    this.#save();
    this.#applyTheme();
    this.#notify();
  }

  /**
   * Apply the current theme to the document.
   */
  #applyTheme() {
    const theme = this.settings.theme;
    const root = document.documentElement;

    let appliedTheme = theme;

    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      appliedTheme = prefersDark ? 'dark' : 'light';
    }

    root.setAttribute('data-theme', appliedTheme);
  }

  getAll() {
    return { ...this.settings };
  }
}

export const settingsManager = new SettingsManager();
export default settingsManager;
