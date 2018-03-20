const webpack = require('webpack');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

// 动态查找所有入口文件
let entrys = {};
glob.sync('./app/js/*.*').map(function (item) {
    entrys[item.match(/[\w]+\.js/i)[0].slice(0, -3)] = item;
});
console.log('压缩文件：', entrys);

module.exports = {

    // mode
    mode: 'production',

    // js压缩，生产模式默认为开
    // optimization: {
    //     minimize: true
    // },

    // 入口文件
    entry: entrys,

    // 输出文件
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name].min.js'
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
        // new ExtractTextWebpackPlugin('css/[name].min.css')
    ]
};