/**
 * @description loader for image
 * @see https://github.com/imagemin
 * @author Leon.Cai
 */

module.exports = (config) => {

    let imageLoader = {
        loader: "img-loader",
        options: {
            enabled: true,
            gifsicle: {
                interlaced: false
            },
            mozjpeg: {
                progressive: true,
                arithmetic: false,
                quality: 85
            },
            optipng: { //png
                optimizationLevel: 2
            },
            pngquant: {
                quality: "75-90",
                floyd: 0.5,
                speed: 8,
                verbose: true
            },
            svgo: {
                plugins: [{
                    removeTitle: true
                }, {
                    convertPathData: false
                }, {
                    removeViewBox: false
                }, {
                    removeEmptyAttrs: false
                }]
            }
        }
    };

    return {
        imageLoader
    };
};