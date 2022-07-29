export default class Bird {
  constructor(x, y, w, h, floorY) {
    this.w = w;
    this.h = h;
    this.x = x;
    this.y = y - this.h / 2;

    this.v = 4;
    this.g = 0.78;

    this.floorY = floorY;
  }

  fly() {
    this.v = this.h * -0.3;
  }

  isOnFloor() {
    return this.y + this.h >= this.floorY;
  }

  update() {
    this.y += this.v;
    this.v += this.g;

    if (this.y + this.h >= this.floorY) {
      this.y = this.floorY - this.h;
    }

    if (this.y <= 0) {
      this.y = 0;
    }
  }

  draw(p5, image, dying = false) {
    if (!dying) {
      p5.image(image, this.x, this.y);
      return;
    }

    p5.image(image, this.x + this.w / 3, this.y, this.h, this.w);
  }
}
