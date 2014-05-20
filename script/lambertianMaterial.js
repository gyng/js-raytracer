/* Ideal matte material: the apparent brightness of a Lambertian reflector
   is the same regardless of the observer's angle of view.

   Isotropic and follows Lambert's cosine law.
 */
function LambertianMaterial (opts) {
  this.Ka = 0;
  this.Ks = 0;
  this.Kd = 1;
  this.opacity = 1;
  this.ambientColor = new Color(0, 0, 0);
  this.diffuseColor = new Color(0.6, 0.6, 0.6);
  this.isSpecular = false;
  this.isRefractive = false;

  Util.extend(this, opts);
}

LambertianMaterial.prototype = {
  sample: function (args) {
    var N = args.N.normalize();
    var L = args.L.normalize();
    var light = args.light;

    return this.diffuse(N, L, light).scale(this.Kd);
  },

  diffuse: function (N, L, light) {
    return this.ambientColor.scale(this.Ka)
      .add(light.color.multiply(this.diffuseColor.scale(N.dot(L))));
  }
};
