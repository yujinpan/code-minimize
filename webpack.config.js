const webpack = require('webpack');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

// 动态查找所有js入口文件
let entrys_js = {};
glob.sync('./app/js/*.*').map(function (item) {
    entrys_js[item.match(/[\w]+\./i)[0].slice(0, -1)] = item;
});
console.log('压缩js文件：', entrys_js);

// 动态查找所有css入口文件
let entrys_css = {};
glob.sync('./app/css/*.*').map(function (item) {
    entrys_css[item.match(/[\w]+\./i)[0].slice(0, -1)] = item;
});
console.log('压缩css文件：', entrys_css);

module.exports = [{

    // mode
    // mode: 'production',

    // js压缩，生产模式默认为开
    // optimization: {
    //     minimize: true
    // },

    // 入口文件
    entry: entrys_js,

    // 输出文件
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].min.js'
    },

    // plugins
    plugins: [
        new CleanWebpackPlugin(['dist/**/**'], {
            root: __dirname
        }),
        new webpack.optimize.UglifyJsPlugin()
    ]
},{

    // 入口文件
    entry: entrys_css,

    // 输出文件
    output: {
        path: __dirname + '/dist',
        filename: 'css/[name].min.css'
    },

    // module
    module: {
        rules: [
            {
                test: /\.(less|css)$/,
                use: ExtractTextWebpackPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        },
                        {
                            loader: 'less-loader'
                        }
                    ]
                })
            }
        ]
    },

    // plugins
    plugins: [
        new CleanWebpackPlugin(['dist/**/**'], {
            root: __dirname
        }),
        new ExtractTextWebpackPlugin('css/[name].min.css')
    ]
}];