const webpack = require('webpack');
const glob = require('glob');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

/**
 * 动态查找多个入口(js|css)文件
 */
// 获取路径方法，默认js文件
const getFileParams = (type = 'js') => {
    let result = {};
    glob.sync('./app/' + type + '/*.*').forEach(function (item) {
        result[item.match(/[\w]+\./i)[0].slice(0, -1)] = item;
    });
    return result;
};
// js
const entrysJS = getFileParams();
console.log('压缩js文件：', entrysJS);

// css
const entrysCSS = getFileParams('css');
console.log('压缩css文件：', entrysCSS);

/**
 * 公用plugins
 */
const pluginsCommon = [
    new CleanWebpackPlugin(['dist/**/**'], {
        root: __dirname
    }),
    // 设置node为生产环境
    new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production')
    }),
];

module.exports = [
    /**
     * js打包配置
     */
    {
        // 入口文件
        entry: entrysJS,

        // 输出文件
        output: {
            path: __dirname + '/dist',
            filename: 'js/[name].min.js'
        },

        // plugins
        plugins: [
            new webpack.optimize.UglifyJsPlugin()
        ].concat(pluginsCommon)
    },
    /**
     * css打包配置
     */
    {
        // 入口文件
        entry: entrysCSS,

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
            new ExtractTextWebpackPlugin('css/[name].min.css')
        ].concat(pluginsCommon)
    }
];