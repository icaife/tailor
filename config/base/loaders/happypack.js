/**
 * @description happypack lodaer
 * @author Leon.Cai
 */

const name = "happypack/loader",
	prefix = `${name}?id=`,
	happyStyleLoaderName = "happy-style-loader",
	happyJsLoaderName = "happy-js-loader",
	happyStyleLoader = `${prefix}${happyStyleLoaderName}`,
	happyJsLoader = `${prefix}${happyJsLoaderName}`;

module.exports = {
	name,
	prefix,
	happyStyleLoaderName,
	happyJsLoaderName,
	happyStyleLoader,
	happyJsLoader
};
