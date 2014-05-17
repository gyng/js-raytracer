function Sphere (opts) {
  this.center = new Vector(0, 0, 0);
  this.radius = 3;
  this.material = new FlatMaterial();
  this.bounding = null;

  Util.extend(this, opts);
}

Sphere.prototype = {
  intersects: function (ray, tmin, tmax) {
    var a = 1;
    var b = 2 * ray.direction.dot(ray.origin.subtract(this.center));
    var L = ray.origin.subtract(this.center);
    var c = L.dot(L) - this.radius * this.radius;
    var discriminant = b * b - 4 * a * c;

    if (discriminant <= 0) {
      // No intersections
      return false;
    } else {
      var t1 = (-b + Math.sqrt(discriminant)) / 2 * a;
      var t2 = (-b - Math.sqrt(discriminant)) / 2 * a;

      if (t1 >= tmin && t1 <= tmax ||
          t2 >= tmin && t2 <= tmax) {
        // Valid, get smallest valid t value
        var t = Math.abs(t1) < Math.abs(t2) ? t1 : t2;
        var intersectionPoint = ray.origin.add(ray.direction.scale(t));
        var N = intersectionPoint.subtract(this.center).normalize();

        return {
          t: t,
          position: intersectionPoint,
          N: N,
          material: this.material
        };
      } else {
        // Intersections, but outside of t range
        return false;
      }
    }
  },

  /* More efficient version of intersects -- no computing intersection point/normal
   * at intersection point
   */
  shadowIntersects: function (ray, tmin, tmax) {
    var a = 1;
    var b = 2 * ray.direction.dot(ray.origin.subtract(this.center));
    var l = ray.origin.subtract(this.center);
    var c = l.dot(l) - this.radius * this.radius;
    var discriminant = b * b - 4 * a * c;

    if (discriminant <= 0) {
      return false;
    } else {
      var t1 = (-b + Math.sqrt(discriminant)) / 2 * a;
      var t2 = (-b - Math.sqrt(discriminant)) / 2 * a;

      if ((t1 >= tmin && t1 <= tmax) || (t2 >= tmin && t2 <= tmax)) {
        return {
          material: this.material
        };
      } else {
        return false;
      }
    }
  },

  getBounding: function () {
    if (this.bounding === null) {
      this.bounding = new BoundingBox(
        this.center.x + this.radius,
        this.center.x - this.radius,
        this.center.y + this.radius,
        this.center.y - this.radius,
        this.center.z + this.radius,
        this.center.z - this.radius
      );
    }

    return this.bounding;
  }
};
