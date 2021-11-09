class Letter {
  constructor(x, y, scl, char, phi) {
    this._x = x;
    this._y = y;
    this._scl = scl;
    this._char = char;
    this._phi = phi;

    this._threshold = Math.random();
    this._alive = false;
  }

  show(ctx, percent) {
    // percent accounting to position
    const position_percent = wrap(this._phi - Math.PI * 2 * percent, 0, Math.PI * 2) / (Math.PI * 2);
    const adjusted_percent = ease(position_percent);
    // check aliveness
    this._alive = adjusted_percent > this._threshold;
    if (!this._alive) return;

    // text size
    let size = Math.floor((adjusted_percent * 0.5 + 0.5) * this._scl * 1.75);
    // always even so the letters are not misaligned
    if (size % 2 != 0) size++;
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