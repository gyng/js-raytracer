// Axis-aligned bounding box
// https://github.com/ivonu/eth-raytracer/blob/master/src/objects/bounding.js
function BoundingBox (xMax, xMin, yMax, yMin, zMax, zMin) {
  this.xMax = xMax;
  this.xMin = xMin;
  this.yMax = yMax;
  this.yMin = yMin;
  this.zMax = zMax;
  this.zMin = zMin;

  this.xWidth = this.xMax - this.xMin;
  this.yWidth = this.yMax - this.yMin;
  this.zWidth = this.zMax - this.zMin;
}

BoundingBox.prototype = {
  contains: function (bounding) {
    if (bounding.xMin > this.xMax || bounding.xMax < this.xMin) return false;
    if (bounding.yMin > this.yMax || bounding.yMax < this.yMin) return false;
    if (bounding.zMin > this.zMax || bounding.zMax < this.zMin) return false;

    return true;
  },

  intersects: function (ray) {
    var o = ray.origin;
    var d = ray.direction.scale(-1);

    var tx1 = (this.xMin - o.x) / d.x;
    var ty1 = (this.yMin - o.y) / d.y;
    var tz1 = (this.zMin - o.z) / d.z;
    var tx2 = (this.xMax - o.x) / d.x;
    var ty2 = (this.yMax - o.y) / d.y;
    var tz2 = (this.zMax - o.z) / d.z;

    var txMin = Math.min(tx1, tx2);
    var txMax = Math.max(tx1, tx2);
    var tyMin = Math.min(ty1, ty2);
    var tyMax = Math.max(ty1, ty2);
    var tzMin = Math.min(tz1, tz2);
    var tzMax = Math.max(tz1, tz2);

    var tMin = Math.max(txMin, tyMin, tzMin);
    var tMax = Math.min(txMax, tyMax, tzMax);

    return (tMin < tMax);
  }
};

BoundingBox.getBoundingFromObjects = function (objects) {
  var xMin = Infinity;
  var yMin = Infinity;
  var zMin = Infinity;
  var xMax = -Infinity;
  var yMax = -Infinity;
  var zMax = -Infinity;

  for (var i = 0; i < objects.length; i++) {
    var bounding = objects[i].getBounding();
    if (bounding.xMin < xMin) xMin = bounding.xMin;
    if (bounding.yMin < yMin) yMin = bounding.yMin;
    if (bounding.zMin < zMin) zMin = bounding.zMin;
    if (bounding.xMax > xMax) xMax = bounding.xMax;
    if (bounding.yMax > yMax) yMax = bounding.yMax;
    if (bounding.zMax > zMax) zMax = bounding.zMax;
  }

  return new BoundingBox (
    xMax, xMin,
    yMax, yMin,
    zMax, zMin
  );
};
