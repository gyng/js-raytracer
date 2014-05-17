function Triangle (opts) {
  // Barycentric coordinates
  // Vertices
  this.v0 = new Vector(0, 0, 0);
  this.v1 = new Vector(0, 1, 0);
  this.v2 = new Vector(0, 0, 1);

  // Normals
  this.n0 = this.v1.subtract(this.v0).cross(this.v2.subtract(this.v0));
  this.n1 = this.n0;
  this.n2 = this.n0;

  this.material = new FlatMaterial();
  this.bounding = null;

  Util.extend(this, opts);
}

Triangle.prototype = {
  intersects: function (ray, tmin, tmax) {
    var e1 = this.v1.subtract(this.v0);
    var e2 = this.v2.subtract(this.v0);
    var p = ray.direction.cross(e2);
    var a = e1.dot(p);
    if (a === 0) return false;

    var f = 1 / a;
    var s = ray.origin.subtract(this.v0);
    var beta = f * s.dot(p);
    if (beta < 0.0 || beta > 1.0) return false;

    var q = s.cross(e1);
    var gamma = f * ray.direction.dot(q);
    if (gamma < 0.0 || beta + gamma > 1.0) return false;

    var t = f * e2.dot(q);

    if (t < tmin || t > tmax) {
      return false;
    } else {
      var intersectionPoint = ray.origin.add(ray.direction.scale(t));
      var alpha = 1 - beta - gamma;
      var N = this.n0.scale(alpha)
        .add(this.n1.scale(beta))
        .add(this.n2.scale(gamma));

      return {
        t: t,
        position: intersectionPoint,
        N: N,
        material: this.material
      };
    }
  },

  shadowIntersects: function (ray, tmin, tmax) {
    var e1 = this.v1.subtract(this.v0);
    var e2 = this.v2.subtract(this.v0);
    var p = ray.direction.cross(e2);
    var a = e1.dot(p);
    var f = 1 / a;
    var s = ray.origin.subtract(this.v0);
    var beta = f * s.dot(p);
    if (beta < 0.0 || beta > 1.0) return false;

    var q = s.cross(e1);
    var gamma = f * ray.direction.dot(q);
    if (gamma < 0.0 || beta + gamma > 1.0) return false;

    var t = f * e2.dot(q);

    if (t < tmin || t > tmax) {
      return false;
    } else {
      return {
        material: this.material
      };
    }
  },

  getBounding: function () {
    if (this.bounding === null) {
      var minX = Infinity;
      var minY = Infinity;
      var minZ = Infinity;
      var maxX = -Infinity;
      var maxY = -Infinity;
      var maxZ = -Infinity;

      if (this.v0.x < minX) minX = this.v0.x;
      if (this.v1.x < minX) minX = this.v1.x;
      if (this.v2.x < minX) minX = this.v2.x;
      if (this.v0.x > maxX) maxX = this.v0.x;
      if (this.v1.x > maxX) maxX = this.v1.x;
      if (this.v2.x > maxX) maxX = this.v2.x;

      if (this.v0.y < minY) minY = this.v0.y;
      if (this.v1.y < minY) minY = this.v1.y;
      if (this.v2.y < minY) minY = this.v2.y;
      if (this.v0.y > maxY) maxY = this.v0.y;
      if (this.v1.y > maxY) maxY = this.v1.y;
      if (this.v2.y > maxY) maxY = this.v2.y;

      if (this.v0.z < minZ) minZ = this.v0.z;
      if (this.v1.z < minZ) minZ = this.v1.z;
      if (this.v2.z < minZ) minZ = this.v2.z;
      if (this.v0.z > maxZ) maxZ = this.v0.z;
      if (this.v1.z > maxZ) maxZ = this.v1.z;
      if (this.v2.z > maxZ) maxZ = this.v2.z;

      this.bounding = new BoundingBox(
        maxX, minX,
        maxY, minY,
        maxZ, minZ
      );
    }

    return this.bounding;
  }
};
