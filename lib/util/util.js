/**
 * util webpack
 */

const
	FSE = require("fs-extra"),
	Path = require("path");

const util = {
	/**
	 * format input args
	 * @return {Object} formated args
	 */
	args: () => {
		var args = process.argv || [];
		var data = {};
		var argReg = /^\-\-\w+$/;

		for (let i = 0; i < args.length; i++) {
			let item = args[i];

			if (item && !argReg.test(item)) {
				continue;
			}

			let value = args[i + 1];

			if (argReg.test(value) || value === void 0) {
				value = true;
			} else {
				i++;
			}

			data[item.slice(2)] = value;
		}

		return Object.keys(data).length ? data : {};
	},
	/**
	 * find project root
	 * @param  {String} base [description]
	 * @param  {String} flag [description]
	 * @return {String}      [description]
	 */
	findRoot: function(base, flag) {
		let root = "";

		if (!base) {
			base = "../";

			FSE.readdirSync(base).forEach((path) => {
				if (FSE.existsSync(Path.join(base, path, flag))) {
					root = path;
					return false;
				}
			});
		} else {
			if (FSE.existsSync(base, flag)) {
				root = base;
			}
		}

		return root ? Path.resolve(base, root) : false;
	}
};

module.exports = util;