const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require("purifycss-webpack");
const glob = require("glob");
const entry = require("./webpack_config/webpack.config.entry.js");

console.log(encodeURIComponent(process.env.type));
if (process.env.type == "build") {
    var website = {
        publicPath: "192.168.1.200",
        port: '8181/'

    }
} else {
    var website = {
        publicPath: "localhost",
        port: '8181'
    }
}


module.exports = {
    devtool: 'source-map', //打包后的调试 开发工具
    //source-map 最详细的独立文件
    //cheap-module-source-map 简略的独立文件
    //eval-source-map 开发阶段使用 
    //cheap-module-eval-source-map 最快 但是打包后输出的JS文件的执行具有性能和安全的隐患
    entry: entry.path,
    output: { //出口
        path: path.resolve(__dirname, 'dist'), //path..resolve(_dirname,'dist')node语法:获取dist的绝对路径
        filename: '[name].js', //打包的文件
        publicPath: "http://" + website.publicPath + ":" + website.port + "/"
    },
    module: { //例如解读CSS,图片如何转换，压缩
        rules: [{ //规则
            test: /\.css$/,
            use: extractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    { loader: "css-loader", options: { importLoaders: 1 } },
                    'postcss-loader'
                ]
            })
        }, {
            test: /\.(png|jpg|gif)/,
            use: [{
                loader: 'url-loader',
                options: {
                    limit: 5120, //小于5KB的编译为base64
                    outputPath: 'images/' //配置图片保存路径
                }
            }]
        }, {
            test: /\.(html|htm)$/i,
            use: ['html-withimg-loader']
        }, {
            test: /\.less$/,
            use: extractTextPlugin.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "less-loader"
                }],
                fallback: "style-loader"
            })
        }, {
            test: /\.scss$/,
            use: extractTextPlugin.extract({
                use: [{
                    loader: "css-loader"
                }, {
                    loader: "sass-loader"
                }],
                fallback: "style-loader"
            })
        }, {
            test: /\.(jsx|js)$/,
            use: {
                loader: "babel-loader",
            },
            exclude: /node_modules/ //过滤的文件exclude
        }]
    },
    plugins: [ //插件，用于生产模版和各项功能
        // new UglifyJsPlugin()
        new htmlPlugin({ //html打包
            minify: {
                removeAttributeQuotes: true, //去引号
            },
            hash: true, //解决缓存
            template: './src/index.html' //模板
        }),
        new extractTextPlugin("css/index.css"), //CSS分离插件
        new PurifyCSSPlugin({ //消除无用的css代码
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        })
    ],
    devServer: { //配置webpack开发服务器
        contentBase: path.resolve(__dirname, 'dist'),
        host: website.publicPath, //服务器地址
        compress: true, //服务器压缩
        port: website.port, //端口
    }
}