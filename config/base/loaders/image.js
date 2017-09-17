/**
 * @description loader for image
 * @author Leon.Cai
 */

module.exports = (config) => {

    let imageWebpackLoader = {
        loader: "image-webpack-loader",
        options: {
            mozjpeg: { //jpeg
                quality: 80,
                progressive: true,
            },
            bypassOnDebug: true,
            optipng: { //png
                optimizationLevel: 4
            },
            pngquant: { //png
                quality: "75-90",
                speed: 4,
                verbose: true
            },
            svgo: { //svg
                plugins: [{
                    removeViewBox: false
                }, {
                    removeEmptyAttrs: false
                }]
            },
            limit: 10 * 1024
        }
    };

    return {
        imageWebpackLoader
    };
};