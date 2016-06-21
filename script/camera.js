function Camera (opts) {
  // Defaults
  this.position    = new Vector(0, 0, 0);
  this.lookAt      = new Vector(0, 0, 1);
  this.up          = new Vector(0, 1, 0);
  this.fovDeg      = 45;
  this.imageHeight = 320;
  this.imageWidth  = 240;

  this.velocity = new Vector(0, 0, 0);

  Util.extend(this, opts);

  // Update ``projection''
  this.setPosition(this.position);
  this.setFov(this.fovDeg);
}

Camera.prototype = {
  setPosition: function (position) {
    this.position = position;
    this.eye      = this.lookAt.subtract(position).normalize();
    this.vpRight  = this.eye.cross(this.up);
    this.vpUp     = this.vpRight.cross(this.eye);
  },

  setLookAt: function (lookAt) {
    this.lookAt = lookAt;
    this.setPosition(this.position);
  },

  setFov: function (fovDeg) {
    this.fovDeg = fovDeg;

    var fovRad = Math.PI * (this.fovDeg / 2) / 180;
    var ratio  = this.imageHeight / this.imageWidth;
    this.halfWidth  = Math.tan(fovRad);
    this.halfHeight = ratio * this.halfWidth;

    var cameraWidth  = this.halfWidth * 2;
    var cameraHeight = this.halfHeight * 2;
    this.pixelWidth  = cameraWidth / (this.imageWidth - 1);
    this.pixelHeight = cameraHeight / (this.imageHeight - 1);
  },

  setImageSize: function (x, y) {
    this.imageWidth = x;
    this.imageHeight = y;
    this.setFov(this.fovDeg);
  },

  move: function (vector) {
    this.setPosition(this.position.add(vector));
  },

  getRay: function (x, y) {
    return new Ray(
      this.position,
      this.eye
        .add(this.vpRight.scale((x * this.pixelWidth) - this.halfWidth))
        .add(this.vpUp.scale((y * this.pixelHeight) - this.halfHeight))
        .normalize()
    );
  },

  walk: function (vector) {
    this.velocity = vector;
  },

  tick: function () {
    this.position = this.position.add(this.velocity);
    // this.velocity = this.velocity.scale(0.8);
  }
};
