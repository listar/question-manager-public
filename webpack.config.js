var path = require('path')
var webpack = require('webpack')
var extractPlugin = require('extract-text-webpack-plugin')
var htmlPlugin = require('html-webpack-plugin')
const isPro = process.env.NODE_ENV === 'production';


function resolve (dir) {
    return path.join(__dirname, '.', dir)
}

module.exports = {
    target: 'web',
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
        filename: 'build.js?[hash]'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ],
            },
            {
                test: /\.scss$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader'
                ],
            },
            {
                test: /\.sass$/,
                use: [
                    'vue-style-loader',
                    'css-loader',
                    'sass-loader?indentedSyntax'
                ],
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
                        // the "scss" and "sass" values for the lang attribute to the right configs here.
                        // other preprocessors should work out of the box, no loader config like this necessary.
                        'scss': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader'
                        ],
                        'sass': [
                            'vue-style-loader',
                            'css-loader',
                            'sass-loader?indentedSyntax'
                        ]
                    }
                    // other vue-loader options go here
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif|svg|jpeg)$/,
                loader: 'url-loader',
                options: {
                    limit: 4000,
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'file-loader'
            },
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js',
            '@': resolve('src'),
        },
        extensions: ['*', '.js', '.vue', '.json']
    },
    performance: {
        hints: false
    },
    devtool: '#eval-source-map',
    plugins:[
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: isPro ? '"production"' : '"development"'
            }
        }),
        new htmlPlugin({ //根据模板插入css/js等生成最终HTML
            filename: '../index.html', //生成的html存放路径，相对于 path
            template: './src/template/index.html', //html模板路径
        }),
    ]
}


if (isPro) {
    module.exports.output = {
        path: path.resolve(__dirname, './build/app'),
        publicPath: '/build/app/',
        filename: '[name].[chunkhash:10].js'
    }
    module.exports.devtool = false;//'#source-map';
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor'
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'runtime'
        }),
    ])
    module.exports.entry = {
        app: './src/main.js',
        vendor: ['vue', 'vue-router', 'vuex', 'axios']
    }
}else{
    module.exports.devServer = {
        historyApiFallback: true,
        host:'0.0.0.0', //172.25.2.82   // 172.25.2.143
        port:8000,
        noInfo: true,
        overlay: true,
        hot:true,
        // open:true,
    }
}