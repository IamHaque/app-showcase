export default class Environment {
  constructor(x = 0, speed = 0) {
    this.x = x;
    this.speed = speed;
  }

  update(image) {
    this.x -= 1 * this.speed;

    if (this.x + image.width <= 0) {
      this.x = image.width + (this.x + image.width);
    }
  }

  draw(p5, image) {
    p5.image(image, this.x, 0);
  }
}
