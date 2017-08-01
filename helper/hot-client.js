/**
 * @description hot client
 * @author Leon.Cai
 */

"use strict";

require("eventsource-polyfill");

let hotClient = require(`webpack-hot-middleware/client${__resourceQuery}`),
	timmer = 0;
hotClient.subscribe(event => {
	if (event.action = "reload") {
		clearTimeout(timmer);
		console.log("[HMR] " + event.src);
		timmer = setTimeout(function() {
			window.location.reload();
		}, 1000);
	}
});