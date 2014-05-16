function PointLight (opts) {
  this.position = new Vector(0, 10, 0);
  this.color = new Color(1, 1, 1);

  Util.extend(this, opts);
}
