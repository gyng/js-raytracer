function Vector (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Vector.prototype = {
  add: function (other) {
    return new Vector(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    );
  },

  subtract: function (other) {
    return new Vector(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    );
  },

  length: function () {
    return Math.sqrt(
      this.x * this.x +
      this.y * this.y +
      this.z * this.z
    );
  },

  normalize: function () {
    var length = this.length();

    return new Vector(
      this.x / length,
      this.y / length,
      this.z / length
    );
  },

  dot: function (other) {
    return (
      this.x * other.x +
      this.y * other.y +
      this.z * other.z
    );
  },

  cross: function (other) {
    return new Vector(
      this.y * other.z - this.z * other.y,
      this.z * other.x - this.x * other.z,
      this.x * other.y - this.y * other.x
    );
  },

  scale: function (scale) {
    return new Vector(
      this.x * scale,
      this.y * scale,
      this.z * scale
    );
  },

  multiply: function (other) {
    return new Vector(
      this.x * other.x,
      this.y * other.y,
      this.z * other.z
    );
  },

  /* Reflect this vector off a surface with normal N.
     Note that this is not reflecting around (ie. vector to be reflected is not
     in the same direction as output vector -- the flipping is done by the function)
  */
  reflect: function (N) {
    var L = this.scale(-1);
    return N.scale(2 * N.dot(L)).subtract(L);
  },

  /* Refract this vector off an object surface with normal N and index of refraction IOR.
     Detection of ingoing or outcoming vectors assumes all objects are enclosed.
  */
  refract: function(N, IOR) {
    N = N.normalize();
    var I = this.scale(-1).normalize();
    var NdotI = N.dot(I);
    var inside = NdotI < 0;
    N = inside ? N.scale(-1) : N;

    var n1 = inside ? IOR : 1;
    var n2 = inside ? 1 : IOR;
    var ref = n1 / n2;
    var first = I.subtract(N.scale(NdotI)).scale(-ref);
    var disc = 1 - ((ref * ref) * (1 - NdotI * NdotI));

    if (disc >= 0) {
      return first.subtract(N.scale(Math.sqrt(disc))).normalize();
    } else {
      return this.reflect(N);
    }
  }
};
