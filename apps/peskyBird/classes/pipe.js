export default class Pipe {
  constructor(maxHeight, x, w, h, bh) {
    let gap = Math.floor(bh * 2.5 + Math.random() * bh * 0.8);
    let offset = Math.floor(Math.random() * maxHeight * 0.1);
    offset = Math.random() < 0.5 ? offset * -1 : offset;

    this.x = x;
    this.w = w;
    this.h = h;

    this.availableHeight = maxHeight * 0.911;
    this.yTop = this.availableHeight / 2 - gap + offset;
    this.yBottom = this.availableHeight / 2 + gap + offset;

    this.passed = false;
    this.topImage = 1 + Math.floor(Math.random() * 2);
    this.bottomImage = 1 + Math.floor(Math.random() * 2);

    this.rects = [
      {
        rw: this.w * 0.85,
        rh: this.yTop - 2,
        rx: this.x,
        ry: -10,
      },
      {
        rw: this.w * 0.85,
        rh: this.availableHeight,
        rx: this.x,
        ry: this.yBottom + 2,
      },
    ];
  }

  isOffScreen() {
    return this.x + this.w < 0;
  }

  hasPassed(bird) {
    if (!this.passed && bird.x > this.x + this.w * 0.85) {
      this.passed = true;
      return true;
    }
    return false;
  }

  collidesWith(bird) {
    const B = {
      r: bird.h / 2,
      cx: bird.x + bird.w / 2,
      cy: bird.y + bird.h / 2,
    };

    for (let R of this.rects) {
      let testX = B.cx;
      let testY = B.cy;

      if (B.cx < R.rx) testX = R.rx; // left edge
      else if (B.cx > R.rx + R.rw) testX = R.rx + R.rw; // right edge

      if (B.cy < R.ry) testY = R.ry; // top edge
      else if (B.cy > R.ry + R.rh) testY = R.ry + R.rh; // bottom edge

      let distX = B.cx - testX;
      let distY = B.cy - testY;
      let distance = Math.sqrt(distX * distX + distY * distY);

      if (distance <= B.r) {
        return true;
      }
    }

    return false;
  }

  update(speed) {
    this.x -= speed;
    this.rects[0].rx = this.x;
    this.rects[1].rx = this.x;
  }

  draw(p5, images) {
    p5.image(images["tl" + this.topImage], this.x, -10, this.w, this.yTop);

    p5.image(
      images["tl" + this.bottomImage],
      this.x,
      this.yBottom,
      this.w,
      this.availableHeight - this.yBottom
    );
  }
}
