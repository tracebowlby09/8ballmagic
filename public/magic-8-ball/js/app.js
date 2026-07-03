/**
 * Magic 8 Ball - Application Entry Point
 *
 * This file bootstraps the application and wires all modules together.
 * It handles the main user interaction loop:
 *   1. User enters a question
 *   2. Animation plays
 *   3. Response is selected
 *   4. Effects and audio trigger
 *   5. Statistics and history are updated
 */

import { selectResponse, getProbabilityMap } from './randomizer.js';
import { ballAnimator } from './ball.js';
import { audioManager } from './audio.js';
import { effectsManager } from './effects.js';
import { historyManager } from './history.js';
import { statsManager } from './stats.js';
import { settingsManager } from './settings.js';
import { uiManager } from './ui.js';

/**
 * Initialize the application.
 */
async function init() {
  // Refresh randomizer in case responses were updated
  import('./randomizer.js').then((m) => m.refreshWeightTable());

  // Bind UI events
  bindEvents();

  // Load probability information (useful for debugging/analytics)
  loadProbabilityMap();

  // Listen for settings changes
  settingsManager.onChange((settings) => {
    audioManager.setEnabled(settings.soundEnabled);
    uiManager.syncSettingsUI(settings);
  });

  // Log ready state
  console.log('%c🔮 Magic 8 Ball is ready.', 'color: #a855f7; font-size: 16px; font-weight: bold;');
  console.log(`%cTotal responses: ${selectResponse ? 'loaded' : 'none'}`, 'color: #b0b0c8;');
}

/**
 * Bind all DOM event listeners.
 */
function bindEvents() {
  const { elements } = uiManager;

  // Question form submission
  elements.questionForm?.addEventListener('submit', handleQuestionSubmit);

  // History
  elements.btnHistory?.addEventListener('click', () => uiManager.showHistory());
  elements.btnCloseHistory?.addEventListener('click', () => uiManager.hideHistory());

  // Statistics
  elements.btnStats?.addEventListener('click', () => uiManager.showStats());
  elements.btnCloseStats?.addEventListener('click', () => uiManager.hideStats());
  elements.btnClearStats?.addEventListener('click', handleClearStats);

  // Settings
  elements.btnSettings?.addEventListener('click', () => uiManager.showSettings());
  elements.btnCloseSettings?.addEventListener('click', () => uiManager.hideSettings());
  elements.btnClearHistory?.addEventListener('click', handleClearHistory);
  elements.btnResetSettings?.addEventListener('click', handleResetSettings);

  // Settings toggles
  elements.toggleSound?.addEventListener('click', () => toggleSetting('soundEnabled'));
  elements.toggleAnimations?.addEventListener('click', () => toggleSetting('animationsEnabled'));
  elements.toggleClearInput?.addEventListener('click', () => toggleSetting('autoClearInput'));
  elements.themeSelect?.addEventListener('change', (e) => setSetting('theme', e.target.value));

  // Screen overlay click closes modals
  elements.screenOverlay?.addEventListener('click', () => uiManager.closeAllOverlays());

  // Keyboard: Escape closes panels
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      uiManager.closeAllOverlays();
    }
  });

  // Ball interaction: clicking the ball refocuses input and shakes
  elements.ballContainer?.addEventListener('click', () => {
    elements.questionInput?.focus();
  });
}

 /**
  * Handle question form submission.
  */
async function handleQuestionSubmit(e) {
  e.preventDefault();

  const question = uiManager.getQuestion();

  if (!question) {
    uiManager.showError('Please enter a question before asking.');
    return;
  }

  uiManager.hideError();

  // Disable input and show loading state
  uiManager.setLoading(true);
  uiManager.setResponseText('?', '');
  effectsManager.clearAll();

  try {
    const settings = settingsManager.getAll();

    // Initialize audio context on first user interaction
    audioManager.init();

    if (settings.animationsEnabled !== false) {
      await ballAnimator.ask();
    }

    // Select response
    const response = selectResponse();

    if (!response) {
      uiManager.setResponseText('The spirits are silent...', 'var(--color-text-muted)');
      return;
    }

    // Reveal
    if (settings.animationsEnabled !== false) {
      ballAnimator.reveal(response);
      effectsManager.applySpecial(response.special);

      // Wait for reveal animation to be visible
      await new Promise((resolve) => setTimeout(resolve, 600));
    } else {
      uiManager.setResponseText(response.text, response.color || '');
    }

    if (settings.soundEnabled !== false) {
      audioManager.play(response.sound || 'click.mp3');
    }

    // Update history and statistics
    historyManager.addEntry(question, response);
    statsManager.recordResponse(response);

    if (settings.autoClearInput) {
      uiManager.clearQuestion();
    }

    // Let ball settle
    if (settings.animationsEnabled !== false) {
      ballAnimator.settle();
    }
  } finally {
    // Always re-enable the button
    uiManager.setLoading(false);
  }
}

/**
 * Toggle a boolean setting.
 */
function toggleSetting(key) {
  const current = settingsManager.get(key);
  settingsManager.set({ [key]: !current });
}

/**
 * Set a setting value.
 */
function setSetting(key, value) {
  settingsManager.set({ [key]: value });
}

/**
 * Clear all statistics.
 */
function handleClearStats() {
  if (confirm('Are you sure you want to clear all statistics? This cannot be undone.')) {
    statsManager.clear();
    uiManager.hideStats();
  }
}

/**
 * Clear all history.
 */
function handleClearHistory() {
  if (confirm('Are you sure you want to clear your question history? This cannot be undone.')) {
    historyManager.clear();
    uiManager.renderHistory();
    uiManager.hideSettings();
  }
}

/**
 * Reset all settings to defaults.
 */
function handleResetSettings() {
  if (confirm('Are you sure you want to reset all settings and data? This cannot be undone.')) {
    settingsManager.fullReset();
    audioManager.setEnabled(true);
    uiManager.hideSettings();
    location.reload();
  }
}

/**
 * Log probability map for transparency.
 */
function loadProbabilityMap() {
  const probabilities = getProbabilityMap();
  console.group('%c📊 Response Probabilities', 'color: #6366f1; font-weight: bold;');
  for (const [rarity, percent] of Object.entries(probabilities)) {
    console.log(`  ${rarity}: ${percent.toFixed(2)}%`);
  }
  console.groupEnd();
}

// Boot the application when the DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
