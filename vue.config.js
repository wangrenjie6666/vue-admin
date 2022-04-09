const path = require("path");
let timeStamp = new Date().getTime();
function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = {
    publicPath: "./",
    pwa: {
        iconPaths: {
            favicon32: 'new_logo.png',
            favicon16: 'new_logo.png',
            appleTouchIcon: 'new_logo.png',
            maskIcon: 'new_logo.png',
            msTileImage: 'new_logo.png'
        }
    },
    chainWebpack: config => {
        config.resolve.alias
            .set("@", resolve("src"))
            .set("@assets", resolve("src/assets"))
            .set("@components", resolve("src/components"))
            .set("@base", resolve("baseConfig"))
            .set("@public", resolve("public"));
    },
    // 选项...
    filenameHashing: false, // 打包的时候不使用hash值.因为我们有时间戳来确定项目的唯一性了.

    configureWebpack: { //重点
        output: { // 输出重构  打包编译后的 文件名称  【模块名称.版本号.时间戳】
            filename: `[name].${timeStamp}.js`,
            chunkFilename: `[name].${timeStamp}.js`
        },
        externals: {
            TMap: 'TMap'// 腾讯地图
        }
    },
    css: { //重点.
        extract: { // 打包后css文件名称添加时间戳
            filename: `css/[name].${timeStamp}.css`,
            chunkFilename: `css/[name].${timeStamp}.css`,
        }
    },
}
