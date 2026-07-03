/**
 * Audio Module
 *
 * Manages all sound effects for the Magic 8 Ball.
 * To add new sounds, simply drop an audio file into the /audio/ folder
 * and reference its filename in data/responses.js.
 *
 * Supported formats: mp3, ogg, wav, m4a
 */

class AudioManager {
  constructor() {
    this.enabled = true;
    this.volume = 0.5;
    this.audioContext = null;
    this.loadedSounds = new Map();
    this.audioElements = new Map();
  }

  /**
   * Initialize the audio context (must be called after user interaction).
   */
  init() {
    if (this.audioContext) return;
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {
      console.warn('Web Audio API not supported in this environment.');
    }
  }

  /**
   * Build a cache key for a sound filename.
   */
  #getCacheKey(filename) {
    return `${filename}`;
  }

  /**
   * Create or retrieve an HTMLAudioElement for a given filename.
   */
  #getAudioElement(filename) {
    const key = this.#getCacheKey(filename);
    if (this.audioElements.has(key)) {
      return this.audioElements.get(key);
    }

    const audio = new Audio(`audio/${filename}`);
    audio.volume = this.volume;
    audio.preload = 'auto';
    this.audioElements.set(key, audio);
    return audio;
  }

  /**
   * Play a sound effect by filename.
   * Fails silently if the file does not exist or audio is disabled.
   *
   * @param {string} filename
   */
  play(filename) {
    if (!this.enabled) return;
    if (!filename) return;

    this.init();

    try {
      const audio = this.#getAudioElement(filename);
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // File may not exist or playback was interrupted; ignore gracefully.
        });
      }
    } catch (e) {
      // Graceful failure for unsupported audio scenarios.
    }
  }

  /**
   * Set the master volume (0.0 to 1.0).
   */
  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    for (const audio of this.audioElements.values()) {
      audio.volume = this.volume;
    }
  }

  /**
   * Enable or disable all audio.
   */
  setEnabled(enabled) {
    this.enabled = enabled;
  }

  /**
   * Stop all currently playing audio.
   */
  stopAll() {
    for (const audio of this.audioElements.values()) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  /**
   * Pause all audio.
   */
  pauseAll() {
    for (const audio of this.audioElements.values()) {
      if (!audio.paused) {
        audio.pause();
      }
    }
  }

  /**
   * Resume all audio.
   */
  resumeAll() {
    for (const audio of this.audioElements.values()) {
      audio.play().catch(() => {});
    }
  }
}

export const audioManager = new AudioManager();
export default audioManager;
