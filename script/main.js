(function () {
  "use strict";

  var canvas = document.getElementById("output");

  var red = new CookTorranceMaterial({
    Ks: 0,
    Kd: 1,
    isReflective: false,
    diffuseColor: new Color(0.6, 0.0, 0.0)
  });

  var shinyRed = new CookTorranceMaterial({
    Ks: 0.4,
    Kd: 0.6,
    diffuseColor: new Color(0.6, 0.0, 0.0)
  });

  var green = new CookTorranceMaterial({
    Ks: 0,
    Kd: 1,
    isReflective: false,
    diffuseColor: new Color(0.0, 0.6, 0.0)
  });

  var blue = new CookTorranceMaterial({
    Kd: 0.6,
    Ks: 0.4,
    diffuseColor: new Color(0.4, 0.4, 0.7),
    specularColor: new Color(0.4, 0.4, 0.7)
  });

  var glassy = new CookTorranceMaterial({
    Kd: 0,
    Ks: 0.1,
    opacity: 0,
    IOR: 1.2,
    isRefractive: true,
    diffuseColor: new Color(1, 1, 1),
    specularColor: new Color(1, 1, 1)
  });

  var grey = new CookTorranceMaterial({
    Ks: 0,
    Kd: 1,
    isReflective: false,
    diffuseColor: new Color(0.6, 0.6, 0.6)
  });

  var flat = new FlatMaterial();

  var cornellBounds = new BoundingBox(400, -400, 400, -400, 400, -400);
  var scene = {
    lights: [
      new PointLight({ position: new Vector(50, 90, 50), color: new Color(1, 1, 1) })
    ],
    objects: [
      new Sphere({ center: new Vector(30, 15, 20), radius: 15, material: new CookTorranceMaterial() }),
      new Sphere({ center: new Vector(70, 17, 60), radius: 17, material: glassy }),
      new Sphere({ center: new Vector(50, 50, 20), radius: 10, material: blue }),

      new Plane({ a: 0, b: 0, c: 1, d: 0, material: grey, bounding: cornellBounds }),
      new Plane({ a: 1, b: 0, c: 0, d: 0, material: red, bounding: cornellBounds }),
      new Plane({ a:-1, b: 0, c: 0, d: 100, material: green, bounding: cornellBounds }),
      new Plane({ a: 0, b: 1, c: 0, d: 0, material: grey, bounding: cornellBounds }),
      new Plane({ a: 0, b:-1, c: 0, d: 100, material: grey, bounding: cornellBounds })
    ],
    background: new Color(0, 0, 0),
    octree: null
  };

  var camera = new Camera({
    position: new Vector(50, 25, 300),
    lookAt: new Vector(50, 50, 50),
    up: new Vector(0, 1, 0),
    imageWidth: canvas.width,
    imageHeight: canvas.height
  });

  var renderer = new Renderer({
    canvas: canvas,
    camera: camera,
    scene: scene
  });
  renderer.render();



  // Shitty code ahead
  // TODO: hook controls to camera, maybe
  document.onkeydown = function (e) {
    var renderOn = [65, 68, 83, 87, 82, 70, 81, 69, 90, 88, 74, 73, 76, 75, 80, 59, 85, 79];
    var render = (renderOn.indexOf(e.keyCode) >= 0);

    switch (e.keyCode) {
    // Camera
    case 65: camera.move(new Vector(-10, 0, 0)); break; // a
    case 68: camera.move(new Vector(10, 0, 0));  break; // d
    case 83: camera.move(new Vector(0, 0, -10)); break; // s
    case 87: camera.move(new Vector(0, 0, 10));  break; // w
    case 82: camera.move(new Vector(0, 10, 0));  break; // r
    case 70: camera.move(new Vector(0, -10, 0)); break; // f
    case 81: camera.setFov(camera.fovDeg + 10);  break; // q
    case 69: camera.setFov(camera.fovDeg - 10);  break; // e
    case 90: camera.move(camera.eye.normalize().scale(10));  break; // z
    case 88: camera.move(camera.eye.normalize().scale(-10)); break; // x

    // Lights
    case 74: // j
      scene.lights[0].position = scene.lights[0].position.add(new Vector(-10, 0, 0)); break;
    case 73: // i
      scene.lights[0].position = scene.lights[0].position.add(new Vector(0, 0, 10)); break;
    case 76: // l
      scene.lights[0].position = scene.lights[0].position.add(new Vector(10, 0, 0)); break;
    case 75: // k
      scene.lights[0].position = scene.lights[0].position.add(new Vector(0, 0, -10)); break;
    case 80: // p
      scene.lights[0].position = scene.lights[0].position.add(new Vector(0, 10, 0)); break;
    case 59: // ;
      scene.lights[0].position = scene.lights[0].position.add(new Vector(0, -10, 0)); break;
    case 85: // u
      scene.lights[0].color = scene.lights[0].color.scale(0.8); break;
    case 79: // o
      scene.lights[0].color = scene.lights[0].color.scale(1.2); break;
    }

    if (render) {
      console.log("light", scene.lights[0].position, scene.lights[0].color, "camera", camera.position, "fov", camera.fovDeg, "key", e.keyCode);
      renderer.render();
    }
  };

  // Click to look at
  canvas.addEventListener("mousedown", function (e) {
    console.log(e);
    var x = (e.clientX - canvas.offsetLeft) / canvas.clientWidth * canvas.width;
    var y = -1 * (e.clientY - canvas.offsetHeight) / canvas.clientHeight * canvas.height;
    console.log(x, y, renderer.screenToWorld(x, y));
    var newLookAt = renderer.screenToWorld(x, y);

    if (newLookAt) {
      camera.setLookAt(newLookAt);
      renderer.render();
    }
  });

  // Force render
  document.getElementById("render").addEventListener("click", function (e) {
    renderer.render();
  });

  // Bunny
  document.getElementById("bunny").addEventListener("click", function (e) {
    var bunny = document.getElementById("bunny-model").innerHTML;
    scene.lights[0].position = new Vector(200, -200, 100);
    scene.objects = OBJReader.read(bunny, shinyRed);
    scene.objects.push(new Plane({ a: 0, b: 0, c: 1, d: 0, material: green, bounding: cornellBounds }));
    scene.objects.push(new Sphere({ center: new Vector(-75, 60, 50), radius: 40, material: new CookTorranceMaterial() }));
    scene.octree = null;
    scene.background = new Color(0.3, 0.5, 0.8);
    camera.up = new Vector(0, 0, 1);
    camera.setPosition(new Vector(0, -200, 30));
    camera.setLookAt(new Vector(0, 60, 50));

    renderer.render();
  });

  // Image quality
  document.getElementById("resolution-form").querySelector("input[name='width']").value = canvas.width;
  document.getElementById("resolution-form").querySelector("input[name='height']").value = canvas.height;
  document.getElementById("resolution-form").querySelector("input[name='reflect']").value = renderer.reflectDepth;
  document.getElementById("resolution-form").querySelector("input[name='refract']").value = renderer.refractDepth;
  document.getElementById("resolution-form").addEventListener("submit", function (e) {
    e.preventDefault();
    canvas.width = this.querySelector("input[name='width']").value;
    canvas.height = this.querySelector("input[name='height']").value;
    camera.setImageSize(canvas.width, canvas.height);

    renderer.reflectDepth = this.querySelector("input[name='reflect']").value;
    renderer.refractDepth = this.querySelector("input[name='refract']").value;

    renderer.render();
  });

  // Octree
  document.getElementById("octree-toggle").innerHTML = "octree: " + renderer.useOctree;
  document.getElementById("octree-toggle").addEventListener("click", function (e) {
    renderer.useOctree = !renderer.useOctree;
    this.innerHTML = "octree: " + renderer.useOctree;
  });
})();
