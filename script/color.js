function Color (r, g, b) {
  this.r = r;
  this.g = g;
  this.b = b;
}

Color.prototype = {
  add: function (other) {
    return new Color(
      this.r + other.r,
      this.g + other.g,
      this.b + other.b
    );
  },

  subtract: function (other) {
    return new Color(
      this.r - other.r,
      this.g - other.g,
      this.b - other.b
    );
  },

  scale: function (scale) {
    return new Color(
      this.r * scale,
      this.g * scale,
      this.b * scale
    );
  },

  multiply: function (other) {
    return new Color(
      this.r * other.r,
      this.g * other.g,
      this.b * other.b
    );
  },

  /* Ideally, gamma should range (0, 8)
   * Normal gamma is 2.2 (default)
   */
  gammaCorrect: function (gamma) {
    gamma = gamma || 2.2;
    var correction = 1 / gamma;

    return new Color(
      Math.pow(this.r, correction),
      Math.pow(this.g, correction),
      Math.pow(this.b, correction)
    );
  }
};
