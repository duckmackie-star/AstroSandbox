export class Vector {
  constructor(public x: number, public y: number) {}

  add(v: Vector) {
    return new Vector(this.x + v.x, this.y + v.y);
  }

  sub(v: Vector) {
    return new Vector(this.x - v.x, this.y - v.y);
  }

  mul(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  mag() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  normalize() {
    const m = this.mag();
    if (m === 0) return new Vector(0, 0);
    return new Vector(this.x / m, this.y / m);
  }
}
