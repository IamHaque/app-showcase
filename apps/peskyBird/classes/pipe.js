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
  }

  isOffScreen() {
    return this.x + this.w < 0;
  }

  hasPassed(bird) {
    if (!this.passed && bird.x > this.x + this.w) {
      this.passed = true;
      return true;
    }
    return false;
  }

  collidesWith(bird) {
    if (
      !(bird.y + bird.h < this.yBottom && bird.y > this.yTop) &&
      !(bird.x + bird.w < this.x || bird.x > this.x + this.w * 0.8)
    ) {
      this.passed = true;
      return true;
    }

    return false;
  }

  update(speed) {
    this.x -= speed;
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
