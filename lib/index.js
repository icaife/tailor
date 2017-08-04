/**
 * @description index js for lib
 * @author Leon.Cai
 */

"use strict";

const
	helper = require("./helper"),
	loader = require("./loader"),
	plugin = require("./plugin"),
	util = require("./util"),
	preCommit = require("./hook/pre-commit");

module.exports = {
	helper,
	loader,
	plugin,
	util,
	preCommit
};