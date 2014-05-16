/* jshint esnext: true */

// No texture support
function OBJReader () {}

OBJReader.read = function (obj, material) {
  var lines = obj.split("\n");

  var vertices = [];
  var normals = [];
  var triangles = [];

  lines.forEach(function (line) {
    var tokens = line.split(/ +/);

    switch(tokens[0]) {
      case "#":
        return;
      case "v":
        vertices.push(new Vector(tokens[1], tokens[2], tokens[3]));
        break;
      case "vn":
        normals.push(new Vector(tokens[1], tokens[2], tokens[3]));
        break;
      case "f":
        // CCW order in OBJ
        var pairs = tokens.slice(1)
          .map(function (e) {
            return e.split("/").map(function (e) {
              return parseInt(e, 10) - 1;
            });
        });

        triangles.push(new Triangle({
          v0: vertices[pairs[0][0]],
          v1: vertices[pairs[1][0]],
          v2: vertices[pairs[2][0]],
          n0: normals[pairs[0][2]],
          n1: normals[pairs[1][2]],
          n2: normals[pairs[2][2]],
          material: material
        }));

        break;
    }
  });

  return triangles;
};
