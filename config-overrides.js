const path = require("path");

module.exports = {
  paths: function (paths, env) {
    // Change the build output directory
    paths.appBuild = path.resolve(__dirname, "docs");
    return paths;
  },
};
