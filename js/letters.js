class Letter {
  constructor(x, y, scl, char, phi) {
    this._x = x;
    this._y = y;
    this._scl = scl;
    this._char = char;
    this._phi = phi;

    this._threshold = ease(Math.random());
    this._alive = 1 - this._phi / (Math.PI * 2) > this._threshold;
  }

  show(ctx, percent) {
    // percent accounting to position
    const adjusted_percent = 1 - wrap(this._phi - Math.PI * 2 * percent, 0, Math.PI * 2) / (Math.PI * 2);

    if (!this._alive) {
      if (adjusted_percent > this._threshold) this._alive = true;
      return;
    }

    // check for aliveness 
    if (adjusted_percent > 0.995) this._alive = false;

    // text size
    const size = Math.floor((adjusted_percent * 0.8 + 0.2) * this._scl * 1.75);
    // text adjustment
    const alpha = adjusted_percent * 0.8 + 0.2;
    // round for better performance
    const tx = Math.floor(this._x * this._scl);
    const ty = Math.floor(this._y * this._scl);

    // drawing
    ctx.save();
    ctx.translate(tx, ty);
    ctx.font = `${size}px Hack`;
    ctx.textAlign = "start";
    ctx.textBaseline = "alphabetic";
    ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`;
    ctx.fillText(this._char, tx, ty);
    ctx.restore();
  }
}