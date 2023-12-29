"use strict";

var fs = require("fs");

/**
 *
 * @param path
 * @returns {fn}
 *
 */
exports.requireWalk = function (path) {
  var src = path;
  var fn = function () {
    var args = arguments;

    fs.readdirSync(src).forEach(function (file) {
      var newPath = src + "/" + file;
      var stat = fs.statSync(newPath);
      if (stat.isFile()) {
        if (/(.*)\.(js$|coffee$)/.test(file)) {
          if (args.length) {
            require(newPath).apply(this, args);
          } else {
            require(newPath);
          }
        }
      } else if (stat.isDirectory()) {
        fn(newPath);
      }
    });
  };

  return fn;
};
