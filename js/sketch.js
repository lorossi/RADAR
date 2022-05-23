class Sketch extends Engine {
  preload() {
    // parameters
    this._text = "RADAR".split("");
    this._cols = 80;
    this._duration = 450;
    this._border = 0.2;
    this._recording = false;
  }

  setup() {
    // init script
    console.clear();
    this._capturer_started = false;
    this._capturer = new CCapture({
      format: "png",
    });
    // calculate offset
    this._offset = this.frameCount;
    this._bias = Math.random();
    // create all the letters
    this._letters = [];
    const scl = this.width / this._cols;
    let count = 0;
    for (let y = -this._cols / 2; y < this._cols / 2; y++) {
      for (let x = -this._cols / 2; x < this._cols / 2; x++) {
        // too far from center
        if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) >= this._cols / 4)
          continue;
        // calculate angle relative to center
        const phi = wrap(Math.atan2(y, x), 0, Math.PI * 2);
        // select letter. I'm not sold on the randomness
        const char = this._text[++count % this._text.length];
        // create new letter and push it to array
        const nl = new Letter(x, y, scl, char, phi);
        this._letters.push(nl);
        // increment letter counter
      }
    }
  }

  draw() {
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
    }

    // calculate percent and  border displacement
    const percent = wrap(
      (this.frameCount - this._offset) / this._duration + this._bias
    );
    const displacement = Math.floor((this._border * this.width) / 2);

    // move and scale to accomodate center
    this.ctx.save();
    this.background(0);
    this.ctx.translate(displacement, displacement);
    this.ctx.scale(1 - this._border, 1 - this._border);

    // draw and move letters
    this.ctx.save();
    this._ctx.translate(this.width / 2, this.height / 2);
    this._letters.forEach((l) => l.show(this.ctx, percent));
    this.ctx.restore();

    this.ctx.restore();

    if (this._recording) {
      if (this.frameCount <= this._duration)
        this._capturer.capture(this._canvas);
      else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
      }
    }
  }

  click() {
    this.setup();
  }
}

const wrap = (value, min_val = 0, max_val = 1) => {
  while (value > max_val) value -= max_val - min_val;
  while (value < min_val) value += max_val - min_val;
  return value;
};

const ease = (x) => -(Math.cos(Math.PI * x) - 1) / 2;
