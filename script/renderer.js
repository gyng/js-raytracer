function Renderer (opts) {
  this.reflectDepth = 2;
  this.refractDepth = 4;
  this.shadows = true;
  this.canvas = null;
  this.camera = null;
  this.scene = null;
  this.useOctree = true;

  Util.extend(this, opts);
}

Renderer.prototype = {
  trace: function (ray, scene, reflectDepth, refractDepth, shadows) {
    if (reflectDepth <= 0 || refractDepth <= 0) {
      return new Color(0, 0, 0);
    }

    var nearestHit = null;
    var nearestT = Infinity;
    var candidateObjects;
    var i, j;

    if (this.useOctree) {
      candidateObjects = this.scene.octree.getIntersectionObjects(ray);
    } else {
      candidateObjects = this.scene.objects;
    }

    for (i = 0; i < candidateObjects.length; i++) {
    // for (i = 0; i < scene.objects.length; i++) {
      var tmin = 0.01;
      var hit = candidateObjects[i].intersects(ray, tmin, nearestT);

      if (hit && (nearestHit === null || hit.t < nearestT)) {
        nearestHit = hit;
        nearestT = nearestHit.t;
      }
    }

    if (nearestHit === null) {
      return scene.background;
    }

    // For each light source we get a shadow colour
    // and multiply that to the local shading contributed by that light source.
    var result = new Color(0, 0, 0);
    var shadowColor = new Color(1, 1, 1);

    for (i = 0; i < scene.lights.length; i++) {
      // Shadows
      if (shadows) {
        // L needs to be a unit vector for direct mapping of distanceToLight to tMax
        var Ln = scene.lights[i].position.subtract(nearestHit.position).normalize();
        var distanceToLight = scene.lights[i].position.subtract(nearestHit.position).length();
        var shadowRay = new Ray(nearestHit.position, Ln);

        if (this.useOctree) {
          candidateObjects = this.scene.octree.getIntersectionObjects(shadowRay);
        }

        for (j = 0; j < candidateObjects.length; j++) {
          var shadowHit = candidateObjects[j].intersects(shadowRay, 0.001, distanceToLight);
          if (shadowHit) {
            if (shadowHit.material.isRefractive) {
              // Transparent: attenuate shadow color
              shadowColor = shadowColor.multiply(shadowHit.material.transmissionColor);
            } else {
              // Fully opaque object: no light shall pass
              shadowColor = new Color(0, 0, 0);
              break;
            }
          }
        }
      }

      // Surface shading
      var args = {
        N: nearestHit.N,
        I: ray.direction.scale(-1),
        L: scene.lights[i].position.subtract(nearestHit.position),
        light: scene.lights[i]
      };

      result = result.add(nearestHit.material.sample(args).multiply(shadowColor));
    }

    // Reflections
    if (nearestHit.material.isSpecular && nearestHit.material.Ks > 0) {
      var R = ray.direction.reflect(nearestHit.N);
      var reflectRay = new Ray(nearestHit.position.add(R.scale(0.0001)), R);
      var reflectColor = this.trace(reflectRay, scene, reflectDepth - 1, refractDepth);

      result = result.add(reflectColor.scale(nearestHit.material.Ks));
    }

    // Refractions
    if (nearestHit.material.isRefractive && nearestHit.material.opacity < 1) {
      var T = ray.direction.refract(nearestHit.N, nearestHit.material.IOR);
      var refractRay = new Ray(nearestHit.position.add(T.scale(0.0001)), T);
      var refractColor = this.trace(refractRay, scene, reflectDepth, refractDepth - 1);

      result = result.add(refractColor.scale(1 - nearestHit.material.opacity));
    }

    return result;
  },

  screenToWorld: function (x, y) {
    var nearestHit = null;
    var nearestT = Infinity;
    var ray = this.camera.getRay(x, y);

    for (i = 0; i < this.scene.objects.length; i++) {
      var tmin = 0.01;
      var hit = this.scene.objects[i].intersects(ray, tmin, nearestT);

      if (hit && (nearestHit === null || hit.t < nearestT)) {
        nearestHit = hit;
        nearestT = nearestHit.t;
      }
    }

    return nearestHit ? nearestHit.position : null;
  },

  render: function () {
    var start = new Date().getTime();
    var context = this.canvas.getContext("2d");
    var width = this.canvas.width;
    var height = this.canvas.height;
    var imageData = context.getImageData(0, 0, width, height);

    // TODO: extract out octree reconstruction
    if (this.useOctree && this.scene.octree === null) {
      var depth = Math.min(Math.floor(Math.log(this.scene.objects.length) / Math.log(8)), 10);
      this.scene.octree = new Octree(BoundingBox.getBoundingFromObjects(this.scene.objects), depth);
      for (var i = 0; i < this.scene.objects.length; i++) {
        this.scene.octree.insert(this.scene.objects[i]);
      }
      console.log("Generated octree in ", new Date().getTime() - start, "ms", "Depth:", this.scene.octree.depth);
    }

    for (var x = 0; x < width; x++) {
      for (var y = 0; y < height; y++) {
        var ray = this.camera.getRay(x, y, width, height);
        var color = this.trace(ray, this.scene, this.reflectDepth, this.refractDepth, this.shadows);

        var index = (x * 4) + ((height - y) * width * 4);
        imageData.data[index + 0] = color.r * 255;
        imageData.data[index + 1] = color.g * 255;
        imageData.data[index + 2] = color.b * 255;
        imageData.data[index + 3] = 255;
      }
    }

    context.putImageData(imageData, 0, 0);
    console.log("Time taken for this frame:", new Date().getTime() - start, "ms", "Octree", this.useOctree);
  }
};
