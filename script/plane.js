// Need to supply a bounding box for planes when using octrees.
function Plane (opts) {
  this.a = 0;
  this.b = 1;
  this.c = 0;
  this.d = 0;
  this.material = new FlatMaterial();
  this.bounding = null;

  Util.extend(this, opts);
}

Plane.prototype = {
  intersects: function (ray, tmin, tmax) {
    var N = new Vector(this.a, this.b, this.c);
    var nrd = N.dot(ray.direction);
    var nro = N.dot(ray.origin);
    var t = (-this.d - nro) / nrd;

    if (t < tmin || t > tmax) {
      return false;
    } else {
      var intersectionPoint = ray.origin.add(ray.direction.scale(t));

      return {
        t: t,
        position: intersectionPoint,
        N: N,
        material: this.material
      };
    }
  },

  shadowIntersects: function (ray, tmin, tmax) {
    var n = new Vector(this.a, this.b, this.c);
    var nrd = n.dot(ray.direction);
    var nro = n.dot(ray.origin);
    var t = (-this.d - nro / nrd);

    if (t >= tmin && t <= tmax) {
      return { material: this.material };
    } else {
      return false;
    }
  },

  getBounding: function () {
    if (this.bounding === null) {
      // this.bounding = new BoundingBox(
      //   Infinity, -Infinity,
      //   Infinity, -Infinity,
      //   Infinity, -Infinity
      // );
      this.bounding = new BoundingBox(
        0, 0,
        0, 0,
        0, 0
      );
    }

    return this.bounding;
  }
};
