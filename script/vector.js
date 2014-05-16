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
    var NdotI = N.normalize().dot(this.scale(-1).normalize());
    var n, n1, n2, Nn;

    if (NdotI > 0) {
      // Ingoing
      n1 = 1;
      n2 = IOR;
      Nn = N.normalize();
    } else {
      // Outgoing
      n1 = IOR;
      n2 = 1;
      // Flip normal: normal at exit intersection is pointing opposite to incoming ray.
      NdotI = N.normalize().scale(-1).dot(this.normalize());
      Nn = N.scale(-1).normalize();
    }

    n = n1 / n2;
    var discriminant = 1 - (n * n * (1 - NdotI * NdotI));

    if (discriminant < 0) {
      // Total internal reflection
      return this.reflect(this, Nn);
    } else {
      return this
        .scale(-n)
        .add(Nn.scale(n * NdotI - Math.sqrt(discriminant)));
    }
  }
};
