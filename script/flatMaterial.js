function FlatMaterial (opts) {
  this.color = new Color(0.5, 0.5, 0.7);
  this.Ks = 0;
  this.Ka = 1;
  this.Kd = 1;
  this.opacity = 1;
  this.isSpecular = false;
  this.isRefractive = false;

  Util.extend(this, opts);
}

FlatMaterial.prototype = {
  sample: function (args) {
    return this.color;
  }
};
