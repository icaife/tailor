"use strict";
module.exports = function(source, map) {
    var callback = this.async();

    console.log(this.query);

    this.cacheable && this.cacheable();
    callback(null, source, map);
};

module.exports.raw = true;