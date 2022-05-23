class Letter {
  constructor(x, y, scl, char, phi) {
    this._x = x;
    this._y = y;
    this._scl = scl;
    this._char = char;
    this._phi = phi;

    this._palette = ["#FF00FF", "#00FFFF", "#FFFFFF"];
    // color aberration position
    this._d_pos = [-1, 1, 0];

    this._threshold = Math.random();
    this._alive = false;
  }

  show(ctx, percent) {
    // color aberration palette

    // percent accounting to position
    const position_percent =
      wrap(this._phi - Math.PI * 2 * percent, 0, Math.PI * 2) / (Math.PI * 2);
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
    const hex_alpha = dec_to_hex(alpha * 255);
    // round for better performance
    const tx = Math.floor(this._x * this._scl);
    const ty = Math.floor(this._y * this._scl);

    // drawing
    ctx.save();
    ctx.translate(tx, ty);
    ctx.globalCompositeOperation = "screen";
    ctx.font = `${size}px Hack`;
    ctx.textAlign = "start";
    ctx.textBaseline = "middle";

    for (let i = 0; i < this._d_pos.length; i++) {
      const d_pos = this._d_pos[i];
      const color = this._palette[i] + hex_alpha;
      ctx.fillStyle = color;
      ctx.fillText(this._char, tx + d_pos, ty + d_pos);
    }

    ctx.restore();
  }
}

const dec_to_hex = (dec) =>
  Math.floor(dec).toString(16).padStart(2, 0).toUpperCase();
