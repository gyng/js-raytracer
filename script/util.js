function Util () {}

Util.extend = function (into, from) {
  if (typeof from === "object") {
    Object.keys(from).forEach(function (k) {
      into[k] = from[k];
    });
  }
};
