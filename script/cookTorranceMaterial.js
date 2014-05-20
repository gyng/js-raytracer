/* Cook-Torrance material: a physically-based specular shader which follows
   positivity, obeys the Helmholtz reciprocity, and is energy-conserving.

   It takes into account Fresnel effects, microfacet distribution (modelled by a
   normal distribution) and geometric attenuation (shadowing/masking effects).

   Based off: http://renderman.pixar.com/view/cook-torrance-shader
              http://ruh.li/GraphicsCookTorrance.html
 */
function CookTorranceMaterial (opts) {
  this.Ka = 1;
  this.Ks = 0.8;
  this.Kd = 0.2;
  this.IOR = 1.35;
  this.roughness = 0.15;
  this.opacity = 1;
  this.ambientColor = new Color(0.05, 0.05, 0.05);
  this.specularColor = new Color(1.0, 1.0, 1.0);
  this.diffuseColor = new Color(0.6, 0.6, 0.6);
  this.transmissionColor = new Color(1.0, 1.0, 1.0);
  this.gaussConstant = 100;
  this.isSpecular = true;
  this.isRefractive = false;

  Util.extend(this, opts);
}

CookTorranceMaterial.prototype = {
  sample: function (args) {
    var N = args.N.normalize();
    var I = args.I.normalize();
    var L = args.L.normalize();
    var light = args.light;

    return this.diffuse(N, L, light).scale(this.Kd)
      .add(this.specularColor.scale(this.Ks).multiply(this.specular(N, I, L, light)));
  },

  /* Standard Lambertian diffuse */
  diffuse: function (N, L, light) {
    return this.ambientColor.scale(this.Ka)
      .add(light.color.multiply(this.diffuseColor.scale(N.dot(L))));
  },

  /* Cook-Torrance magic going on here */
  brdf: function (N, I, L) {
    var Nn = N.normalize();
    var Vn = I.normalize();
    var Ln = L.normalize();

    var NdotV = Nn.dot(Vn);
    var H = Vn.add(Ln).normalize();

    var NdotH = Nn.dot(H);
    var NdotL = Nn.dot(Ln);
    var VdotH = Vn.dot(H);

    // Approximate Fresnel term, Schlick's approximation
    n1 = 1;
    n2 = this.IOR;
    var f0 = Math.pow((n1 - n2) / (n1 + n2), 2);
    var F = Math.pow(1 - VdotH, 5) * (1 - f0) + f0;

    // Microfacet distribution
    var alpha = Math.acos(NdotH);
    var D = this.gaussConstant * Math.exp(-(alpha * alpha) / (this.roughness * this.roughness));

    // Geometric attenuation factor
    var g1 = (2 * NdotH * NdotV) / VdotH;
    var g2 = (2 * NdotH * NdotL) / VdotH;
    var G = Math.min(g1, g2);

    // Sum contribution
    return F * D * G / (NdotV * NdotL * Math.PI);
  },

  specular: function (N, I, L, light) {
    var Nn = N.normalize();
    var Ln = L.normalize();
    var NdotL = Nn.dot(Ln);

    return light.color
      .scale(NdotL)
      .scale(this.brdf(N, I, L) * this.Ks);
  }
};
