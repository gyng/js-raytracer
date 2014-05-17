// Adapter from https://github.com/ivonu/eth-raytracer/blob/master/src/objects/octree.js
function Octree(bounding, depth) {
  this.bounding = bounding;
  this.data = null;
  this.children = [];
  this.depth = depth;
}

Octree.prototype = {
  isLeaf: function () {
    return (this.children.length === 0);
  },

  makeChildren: function () {
    for (var x = 0; x < 2; x++) {
      for (var y = 0; y < 2; y++) {
        for (var z = 0; z < 2; z++) {
          var newBounding = new BoundingBox(
            this.bounding.xMax - (1-x) * this.bounding.xWidth / 2,
            this.bounding.xMin +    x  * this.bounding.xWidth / 2,
            this.bounding.yMax - (1-y) * this.bounding.yWidth / 2,
            this.bounding.yMin +    y  * this.bounding.yWidth / 2,
            this.bounding.zMax - (1-z) * this.bounding.zWidth / 2,
            this.bounding.zMin +    z  * this.bounding.zWidth / 2
          );

          this.children.push(new Octree(newBounding, this.depth-1));
        }
      }
    }
  },

  insert: function (object) {
    // Maximum depth
    if (this.depth <= 0) {
      if (this.data === null) {
        this.data = [];
      }
      this.data.push(object);
      return;
    }

    // Empty leaf node
    if (this.isLeaf() && this.data === null) {
      this.data = object;
      return;
    }

    // Filled leaf node: we need to split
    if (this.isLeaf() && this.data !== null) {
      this.makeChildren();
      var old = this.data;
      this.data = null;
      this.insert(old);
    }

    // Interior node (has children)
    if (this.isLeaf() === false) {
      var objBounding = object.getBounding();

      for (var i = 0; i < this.children.length; i++) {
        if (this.children[i].bounding.contains(objBounding)) {
          this.children[i].insert(object);
        }
      }
      return;
    }
  },

  getIntersectionObjects: function (ray) {
    if (this.isLeaf()) {
      if (this.data !== null && this.depth <= 0) return this.data;
      if (this.data !== null) return [this.data];
      return [];
    }

    var objects = [];

    for (var i = 0; i < 8; i++) {
      if (this.children[i].bounding.intersects(ray)) {
        objects = objects.concat(this.children[i].getIntersectionObjects(ray));
      }
    }

    return objects;
  }
};
