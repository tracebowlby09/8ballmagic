/**
 * Effects Module
 *
 * Handles special reveal effects triggered by rare/epic/legendary responses.
 * Supported special effect types:
 *   'gold'        - Golden glow pulse on the ball and surrounding area.
 *   'rainbow'     - Rainbow gradient animation and rainbow glow on the ball.
 *   'confetti'    - Falling colored particles from the top of the screen.
 *   'screen-shake'- Brief hard shake of the entire viewport.
 *   'mystic'      - Flash overlay followed by slow reveal glow.
 *
 * Add new effect types here to extend the response system.
 */

export class EffectsManager {
  constructor() {
    this.container = document.getElementById('special-effects');
    this.ball = document.getElementById('ball');
    this.activeEffects = new Set();
  }

  clearAll() {
    if (!this.container) return;
    this.container.innerHTML = '';
    document.body.classList.remove('effect-gold', 'effect-rainbow', 'effect-shake');
    if (this.ball) {
      this.ball.classList.remove('effect-gold-glow', 'effect-rainbow-glow');
    }
    this.activeEffects.clear();
  }

  // --------------------------------------------------------------------------
  // Gold Effect
  // --------------------------------------------------------------------------
  triggerGold() {
    if (!this.container || !this.ball) return;
    document.body.classList.add('effect-gold');
    this.ball.classList.add('effect-gold-glow');

    setTimeout(() => {
      document.body.classList.remove('effect-gold');
      this.ball.classList.remove('effect-gold-glow');
    }, 3000);
  }

  // --------------------------------------------------------------------------
  // Rainbow Effect
  // --------------------------------------------------------------------------
  triggerRainbow() {
    if (!this.container || !this.ball) return;
    document.body.classList.add('effect-rainbow');
    this.ball.classList.add('effect-rainbow-glow');

    setTimeout(() => {
      document.body.classList.remove('effect-rainbow');
      this.ball.classList.remove('effect-rainbow-glow');
    }, 4000);
  }

  // --------------------------------------------------------------------------
  // Screen Shake
  // --------------------------------------------------------------------------
  triggerScreenShake(duration = 800) {
    if (!this.container) return;
    document.body.classList.add('effect-shake');
    setTimeout(() => {
      document.body.classList.remove('effect-shake');
    }, duration);
  }

  // --------------------------------------------------------------------------
  // Confetti
  // --------------------------------------------------------------------------
  triggerConfetti(count = 60, duration = 2500) {
    if (!this.container) return;

    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffd700', '#ff6b9d'];
    const shapes = ['square', 'circle', 'triangle'];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      particle.classList.add('confetti-particle');

      const color = colors[Math.floor(Math.random() * colors.length)];
      const shape = shapes[Math.floor(Math.random() * shapes.length)];
      const left = Math.random() * 100;
      const size = Math.random() * 8 + 4;
      const delay = Math.random() * (duration / 2);
      const drift = (Math.random() - 0.5) * 120;

      particle.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        border-radius: ${shape === 'circle' ? '50%' : shape === 'triangle' ? '0' : '2px'};
        transform: rotate(${Math.random() * 360}deg);
        opacity: 1;
        animation: confettiFall ${duration}ms ease-in ${delay}ms forwards;
        --drift: ${drift}px;
      `;

      if (shape === 'triangle') {
        particle.style.clipPath = 'polygon(50% 0%, 0% 100%, 100% 100%)';
      }

      this.container.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, duration + delay + 100);
    }
  }

  // --------------------------------------------------------------------------
  // Mystic Flash
  // --------------------------------------------------------------------------
  triggerFlash(duration = 400) {
    if (!this.container) return;
    const flash = document.createElement('div');
    flash.classList.add('flash-overlay');
    flash.style.cssText = `
      position: absolute;
      inset: 0;
      background: white;
      opacity: 0;
      animation: flash ${duration}ms ease-out forwards;
      pointer-events: none;
    `;
    this.container.appendChild(flash);
    setTimeout(() => flash.remove(), duration + 50);
  }

  // --------------------------------------------------------------------------
  // Orchestrate effects based on a response's 'special' field.
  // --------------------------------------------------------------------------
  applySpecial(special) {
    if (!special) return;

    switch (special) {
      case 'gold':
        this.triggerGold();
        break;
      case 'rainbow':
        this.triggerRainbow();
        break;
      case 'confetti':
        this.triggerConfetti();
        break;
      case 'screen-shake':
        this.triggerScreenShake();
        break;
      case 'mystic':
        this.triggerFlash();
        setTimeout(() => this.triggerGold(), 300);
        break;
      default:
        console.warn(`Unknown special effect type: ${special}`);
    }
  }
}

export const effectsManager = new EffectsManager();
export default effectsManager;
