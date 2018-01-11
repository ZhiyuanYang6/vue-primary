const path = require('path');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin'); //webpack的css分离插件

var website = {
    publicPath: "http://192.168.0.104:8282/"
}

module.exports = {
    entry: { //入口文件
        entry: './src/entry.js',
    },
    output: { //出口
        path: path.resolve(__dirname, 'dist'), //path..resolve(_dirname,'dist')node语法:获取dist的绝对路径
        filename: '[name].js', //打包的文件
        publicPath: website.publicPath,
    },
    module: { //例如解读CSS,图片如何转换，压缩
        rules: [{ //规则
            test: /\.css$/,
            use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
            // [ //['style-loader', 'css-loader']//use/loader
            //     { loader: 'style-loader' },
            //     { loader: 'css-loader' }
            // ]
            // inclu
        }, {
            test: /\.(png|jpg|gif)/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 5000
                }
            }, ]
        }]
    },
    plugins: [ //插件，用于生产模版和各项功能
        // new UglifyJsPlugin()
        new htmlPlugin({
            minify: {
                removeAttributeQuotes: true, //去引号
            },
            hash: true, //解决缓存
            template: './src/index.html' //模板
        }),
        new extractTextPlugin("/css/index.css")
    ],
    devServer: { //配置webpack开发服务器
        contentBase: path.resolve(__dirname, 'dist'),
        host: '192.168.0.104', //服务器地址
        compress: true, //服务器压缩
        port: 8282, //端口
    }
}