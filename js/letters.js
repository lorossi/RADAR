class Letter {
  constructor(x, y, scl, char, phi) {
    this._x = x;
    this._y = y;
    this._scl = scl;
    this._char = char;
    this._phi = phi;

    this._threshold = easeOutCubic(Math.random());
    this._alive = false;
  }

  show(ctx, percent) {
    // percent accounting to position
    const adjusted_percent = easeOutQuadratic(1 - wrap(this._phi - Math.PI * 2 * percent, 0, Math.PI * 2) / (Math.PI * 2));

    if (!this._alive) {
      if (adjusted_percent > this._threshold) this._alive = true;
      else return;
    }

    // check for aliveness 
    if (adjusted_percent > 0.995) this._alive = false;

    // text size
    let size = Math.floor((adjusted_percent * 0.5 + 0.5) * this._scl * 1.75);
    if (size % 2 != 0) size++; // always even so the letters stay always centered
    // text adjustment
    const alpha = adjusted_percent * 0.5 + 0.5;
    const channel = 200 * adjusted_percent + 30;
    // round for better performance
    const tx = Math.floor(this._x * this._scl);
    const ty = Math.floor(this._y * this._scl);

    // drawing
    ctx.save();
    ctx.translate(tx, ty);
    ctx.font = `${size}px Hack`;
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";
    ctx.fillStyle = `rgba(${channel}, ${channel}, ${channel}, ${alpha})`;
    ctx.fillText(this._char, tx, ty);
    ctx.restore();
  }
}