/**
 * Ball Animation Module
 *
 * Controls the Magic 8 Ball animation lifecycle:
 *   idle  -> asking -> revealing -> settling -> idle
 */

export class BallAnimator {
  constructor() {
    this.ballContainer = document.getElementById('ball-container');
    this.ball = document.getElementById('ball');
    this.responseText = document.getElementById('response-text');
    this.isAnimating = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Returns true if the ball is currently performing an animation.
   */
  getAnimatingState() {
    return this.isAnimating;
  }

  /**
   * Trigger the 'ask' animation sequence:
   * 1. Disable idle float
   * 2. Shake the ball
   * 3. Pause (the "thinking" moment)
   * 4. Return a promise that resolves when the reveal phase starts
   */
  async ask() {
    if (this.isAnimating) return null;
    this.isAnimating = true;

    this.#disableIdle();
    this.#resetRevealState();

    const shakeDuration = this.reducedMotion ? 300 : 1200;
    this.#applyShake(this.ball, shakeDuration);

    // Wait for shake + a thinking pause
    const thinkPause = this.reducedMotion ? 400 : 800;
    await this.#wait(shakeDuration + thinkPause);

    return true;
  }

  /**
   * Reveal the answer in the triangle window.
   */
  reveal(response) {
    if (!this.responseText || !this.ball) return;
    if (!response) return;

    const text = response.text;
    const color = response.color || 'var(--color-text)';
    const animationClass = response.animation === 'reveal-glow' ? 'reveal-glow-anim' :
                           response.animation === 'reveal-rainbow' ? 'reveal-rainbow-anim' :
                           response.animation === 'reveal-explosion' ? 'reveal-explosion-anim' :
                           'reveal-anim';

    this.responseText.textContent = text;
    this.responseText.style.color = color;

    // Remove any old animation classes before adding new
    this.responseText.classList.remove('reveal-anim', 'reveal-glow-anim', 'reveal-rainbow-anim', 'reveal-explosion-anim');
    void this.responseText.offsetWidth; // force reflow
    this.responseText.classList.add(animationClass);
  }

  /**
   * Finish the animation and return the ball to idle.
   */
  settle() {
    if (!this.ball || !this.ballContainer) return;
    this.#clearShake(this.ball);
    this.#reEnableIdle();

    const settleDuration = this.reducedMotion ? 200 : 600;
    setTimeout(() => {
      this.isAnimating = false;
    }, settleDuration);
  }

  // --------------------------------------------------------------------------
  // Private helpers
  // --------------------------------------------------------------------------
  #disableIdle() {
    if (!this.ballContainer) return;
    this.ballContainer.style.animation = 'none';
  }

  #reEnableIdle() {
    if (!this.ballContainer) return;
    this.ballContainer.style.animation = '';
  }

  #applyShake(element, duration) {
    if (!element) return;
    if (this.reducedMotion) {
      element.style.animation = `shake ${duration}ms ease-in-out`;
    } else {
      element.style.animation = `shake-hard ${duration}ms ease-in-out`;
    }
  }

  #clearShake(element) {
    if (!element) return;
    element.style.animation = '';
  }

  #resetRevealState() {
    if (!this.responseText) return;
    this.responseText.textContent = '?';
    this.responseText.classList.remove('reveal-anim', 'reveal-glow-anim', 'reveal-rainbow-anim', 'reveal-explosion-anim');
  }

  #wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const ballAnimator = new BallAnimator();
export default ballAnimator;
