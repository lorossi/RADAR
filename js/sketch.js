class Sketch extends Engine {
  setup() {
    // parameters
    this._letters = "ECHOINGREFLECTIONS".split("");
    this._cols = 50;
    this._duration = 150;
    this._border = 0.25;
    this._show_fps = false;
    this._recording = false;
    this._capturer_started = false;

    this._capturer = new CCapture({
      framerate: 60,
      verbose: true,
      motionBlurFrames: true,
      format: "png",
    });

    // init script
    console.clear();
  }

  draw() {
    if (!this._capturer_started && this._recording) {
      this._capturer_started = true;
      this._capturer.start();
    }

    const scl = (this._width * (1 - this._border)) / this._cols;
    const rho = (this._frameCount / this._duration) * (2 * Math.PI) % (2 * Math.PI);

    this._ctx.save();
    this.background(0);
    this._ctx.translate(this._width / 2, this._height / 2);

    let current_letter = 0;
    for (let y = -this._cols / 2; y < this._cols / 2; y++) {
      for (let x = -this._cols / 2; x < this._cols / 2; x++) {
        // maths is strange sometimes
        // i don't get why it's not cols/2
        // but ok, it works
        if (Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) >= this._cols / 4) continue;

        // angles computation and wrapping
        let phi = Math.atan2(y, x);
        if (phi < 0) phi += 2 * Math.PI;
        if (phi > 2 * Math.PI) phi -= 2 * Math.PI;

        let diff = rho - phi;
        if (diff < 0) diff += 2 * Math.PI;
        if (diff > 2 * Math.PI) diff -= 2 * Math.PI;

        // rounding to increase performance - it can run at a steady 60fps
        const percent = this.easeOut(diff / (Math.PI * 2));
        const size = this.roundInt(percent * scl * 1.75);
        const alpha = percent;
        const tx = parseInt(x * scl);
        const ty = parseInt(y * scl);

        // drawing
        this._ctx.save();
        this._ctx.translate(tx, ty);
        this._ctx.font = `${size}px Hack`;
        this._ctx.textAlign = "start";
        this._ctx.textBaseline = "alphabetic";
        this._ctx.fillStyle = `rgba(220, 220, 220, ${alpha})`;
        this._ctx.fillText(this._letters[current_letter], tx, ty);
        this._ctx.restore();

        // update current letter
        current_letter = (current_letter + 1) % this._letters.length;
      }
    }

    this._ctx.restore();

    // show FPS
    if (this._show_fps) {
      this._ctx.save();
      this._ctx.fillStyle = "red";
      this._ctx.font = "30px Hack";
      this._ctx.fillText(parseInt(this._frameRate), 40, 40);
      this._ctx.restore();
    }

    if (this._recording) {
      if (this._frameCount <= this._duration) this._capturer.capture(this._canvas);
      else {
        this._recording = false;
        this._capturer.stop();
        this._capturer.save();
      }
    }
  }

  easeOut(x) {
    return Math.sin((x * Math.PI) / 2);
  }

  roundInt(x, precision = 2) {
    return Math.ceil(x / precision) * precision;
  }
}