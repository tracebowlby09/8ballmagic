/**
 * UI Module
 *
 * Handles DOM element references, updates, and panel/modal management.
 */

import { historyManager } from './history.js';
import { RARITY_COLORS } from '../data/responses.js';

export class UIManager {
  constructor() {
    // Cache DOM references
    this.elements = {
      questionInput: document.getElementById('question-input'),
      askButton: document.getElementById('btn-ask'),
      questionForm: document.getElementById('question-form'),
      inputError: document.getElementById('input-error'),
      responseText: document.getElementById('response-text'),
      ballContainer: document.getElementById('ball-container'),
      ball: document.getElementById('ball'),
      historyPanel: document.getElementById('history-panel'),
      historyList: document.getElementById('history-list'),
      historyEmpty: document.getElementById('history-empty'),
      statsModal: document.getElementById('stats-modal'),
      statsGrid: document.getElementById('stats-grid'),
      settingsModal: document.getElementById('settings-modal'),
      themeSelect: document.getElementById('theme-select'),
      toggleSound: document.getElementById('toggle-sound'),
      toggleAnimations: document.getElementById('toggle-animations'),
      toggleClearInput: document.getElementById('toggle-clear-input'),
      screenOverlay: document.getElementById('screen-overlay'),
      btnHistory: document.getElementById('btn-history'),
      btnStats: document.getElementById('btn-stats'),
      btnSettings: document.getElementById('btn-settings'),
      btnCloseHistory: document.getElementById('btn-close-history'),
      btnCloseStats: document.getElementById('btn-close-stats'),
      btnCloseSettings: document.getElementById('btn-close-settings'),
      btnClearStats: document.getElementById('btn-clear-stats'),
      btnClearHistory: document.getElementById('btn-clear-history'),
      btnResetSettings: document.getElementById('btn-reset-settings'),
    };

    this.historyPage = 1;
    this.historyPageSize = 20;
  }

  // --------------------------------------------------------------------------
  // State getters
  // --------------------------------------------------------------------------
  getQuestion() {
    return this.elements.questionInput ? this.elements.questionInput.value.trim() : '';
  }

  clearQuestion() {
    if (this.elements.questionInput) {
      this.elements.questionInput.value = '';
    }
  }

  setLoading(isLoading) {
    if (!this.elements.askButton) return;
    if (isLoading) {
      this.elements.askButton.classList.add('loading');
      this.elements.askButton.disabled = true;
    } else {
      this.elements.askButton.classList.remove('loading');
      this.elements.askButton.disabled = false;
    }
  }

  showError(message) {
    if (!this.elements.inputError) return;
    this.elements.inputError.textContent = message;
    this.elements.inputError.classList.remove('sr-only');
  }

  hideError() {
    if (!this.elements.inputError) return;
    this.elements.inputError.textContent = '';
    this.elements.inputError.classList.add('sr-only');
  }

  setResponseText(text, color) {
    if (!this.elements.responseText) return;
    this.elements.responseText.textContent = text;
    if (color) {
      this.elements.responseText.style.color = color;
    } else {
      this.elements.responseText.style.color = '';
    }
  }

  // --------------------------------------------------------------------------
  // Panels & Modals
  // --------------------------------------------------------------------------
  showHistory() {
    this.#openPanel(this.elements.historyPanel, this.elements.screenOverlay);
    this.renderHistory();
    this.historyPage = 1;
    this.elements.btnHistory.setAttribute('aria-expanded', 'true');
  }

  hideHistory() {
    this.#closePanel(this.elements.historyPanel, this.elements.screenOverlay);
    this.elements.btnHistory.setAttribute('aria-expanded', 'false');
  }

  showStats() {
    this.#openDialog(this.elements.statsModal, this.elements.screenOverlay);
    this.renderStats();
  }

  hideStats() {
    this.#closeDialog(this.elements.statsModal, this.elements.screenOverlay);
  }

  showSettings() {
    this.#openDialog(this.elements.settingsModal, this.elements.screenOverlay);
    this.syncSettingsUI();
  }

  hideSettings() {
    this.#closeDialog(this.elements.settingsModal, this.elements.screenOverlay);
  }

  closeAllOverlays() {
    this.hideHistory();
    this.hideStats();
    this.hideSettings();
  }

  // --------------------------------------------------------------------------
  // History Rendering
  // --------------------------------------------------------------------------
  renderHistory(entries = null) {
    const list = this.elements.historyList;
    const empty = this.elements.historyEmpty;
    if (!list || !empty) return;

    const data = entries || historyManager.getPage(this.historyPage, this.historyPageSize);

    if (data.length === 0) {
      list.innerHTML = '';
      empty.classList.remove('sr-only');
      return;
    }

    empty.classList.add('sr-only');

    list.innerHTML = data
      .map(
        (entry) => `
        <li class="history-item" data-id="${entry.id}">
          <div class="history-question">${entry.question}</div>
          <div class="history-answer" style="color: ${entry.color || 'inherit'}">${entry.responseText}</div>
          <div class="history-meta">${this.#formatTime(entry.timestamp)}</div>
        </li>
      `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // Statistics Rendering
  // --------------------------------------------------------------------------
  renderStats(summary) {
    const grid = this.elements.statsGrid;
    if (!grid) return;

    const rarityIcons = {
      common: '●',
      uncommon: '◆',
      rare: '★',
      epic: '✧',
      legendary: '⭐',
    };

    grid.innerHTML = `
      <div class="stat-card">
        <div class="stat-value">${summary.totalQuestions}</div>
        <div class="stat-label">Total Questions</div>
      </div>
      ${Object.entries(summary.rarityCounts).map(([rarity, count]) => `
        <div class="stat-card">
          <div class="stat-value" style="color: ${RARITY_COLORS[rarity] || 'inherit'}">${count}</div>
          <div class="stat-label">${rarityIcons[rarity] || ''} ${rarity}</div>
          <div class="stat-sub">${summary.rarityPercentages[rarity]}%</div>
        </div>
      `).join('')}
      <div class="stat-card">
        <div class="stat-value">${summary.mostCommonResponse || '-'}</div>
        <div class="stat-label">Most Common Response</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${summary.rarestResponse || '-'}</div>
        <div class="stat-label">Rarest Response</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${summary.longestStreakNoRare}</div>
        <div class="stat-label">Longest Streak (no Rare)</div>
      </div>
      <div class="stat-card">
        <div class="stat-value">${summary.favorites.length || '-'}</div>
        <div class="stat-label">Favorite Responses</div>
      </div>
    `;
  }

  syncSettingsUI(settings) {
    const s = settings;
    this.#updateToggle(this.elements.toggleSound, !!s?.soundEnabled);
    this.#updateToggle(this.elements.toggleAnimations, !!s?.animationsEnabled);
    this.#updateToggle(this.elements.toggleClearInput, !!s?.autoClearInput);
    if (this.elements.themeSelect && s?.theme) {
      this.elements.themeSelect.value = s.theme;
    }
  }

  // --------------------------------------------------------------------------
  // Private helpers
  // --------------------------------------------------------------------------

  #openPanel(panel, overlay) {
    if (panel) {
      panel.hidden = false;
      panel.style.animation = '';
      panel.classList.add('panel-enter');
    }
    if (overlay) {
      overlay.hidden = false;
      overlay.style.cssText = '';
      overlay.classList.add('active');
    }
  }

  #closePanel(panel, overlay) {
    if (panel) {
      panel.hidden = true;
      panel.classList.remove('panel-enter');
    }
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.hidden = true;
      }, 300);
    }
  }

  #openDialog(dialog, overlay) {
    if (dialog) {
      dialog.showModal?.() || dialog.setAttribute?.('open', '');
      dialog.classList.add('dialog-enter');
    }
    if (overlay) {
      overlay.hidden = false;
      overlay.style.cssText = '';
      overlay.classList.add('active');
    }
  }

  #closeDialog(dialog, overlay) {
    if (dialog) {
      dialog.close?.() || dialog.removeAttribute?.('open');
      dialog.classList.remove('dialog-enter');
    }
    if (overlay) {
      overlay.classList.remove('active');
      setTimeout(() => {
        overlay.hidden = true;
      }, 300);
    }
  }

  #updateToggle(element, isOn) {
    if (!element) return;
    element.setAttribute('aria-checked', String(!!isOn));
  }

  #formatTime(isoString) {
    if (!isoString) return '';
    const date = new Date(isoString);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}

export const uiManager = new UIManager();
export default uiManager;
