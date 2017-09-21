/**
 * @description util for read json
 * @author Leon.Cai
 */
const
    Path = require("path"),
    FSE = require("fs-extra");

module.exports = (jsonPath) => {
    let exist = FSE.existsSync(jsonPath);

    if (exist) {
        let json = FSE.readJsonSync(jsonPath) || {};

        return json;
    } else {
        return {};
    }
};