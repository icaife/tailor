/**
 * util webpack
 */

let util = {
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
};

module.exports = util;