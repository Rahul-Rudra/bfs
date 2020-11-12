const HtmlWebPackPlugin = require('html-webpack-plugin');
var path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
var productionEnv = require('dotenv').config({
  path: __dirname + '/production.env',
});
var developmentEnv = require('dotenv').config({
  path: __dirname + '/development.env',
});
var CompressionPlugin = require('compression-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');
// host:'112.196.32.246',
// port:3009,

module.exports = function (_env, argv) {
  const isProduction = argv.mode === 'production';
  const isDevelopment = !isProduction;
  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'assets/js/[name].[contenthash:8].js',
      publicPath: '/',
    },
    devServer: {
      historyApiFallback: true
      // host:'192.168.1.106',
      // port:3009,
    },
    resolve: {
      extensions: [".jsx", ".js"]
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
          },
        },
        {
          test: /\.html$/,
          use: [
            {
              loader: 'html-loader',
              options: {
                cacheDirectory: true,
                cacheCompression: false,
                envName: isProduction ? 'production' : 'development',
              },
            },
          ],
        },
        {
          test: /\.(png|PNG|gif|jp(e*)g|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8000, // Convert images < 8kb to base64 strings
                name: 'images/[hash]-[name].[ext]',
              },
            },
          ],
        },
        {
          test: /\.css$/i,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            'postcss-loader',
          ],
        },
        {
          test: /\.(eot|otf|ttf|woff|woff2)$/,
          loader: require.resolve('file-loader'),
          options: {
            name: 'static/media/[name].[contenthash].[ext]',
          },
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: './public/index.html',
        filename: './index.html',
        // inject: true
      }),
      isProduction &&
      new MiniCssExtractPlugin({
        filename: 'assets/css/[name].[contenthash].css',
        chunkFilename: 'assets/css/[name].[contenthash].chunk.css',
      }),
      new webpack.DefinePlugin({
        'process.env': isProduction
          ? JSON.stringify(productionEnv.parsed)
          : JSON.stringify(developmentEnv.parsed),
      }),
      new PurgecssPlugin({
        paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, {
          nodir: true,
        }),
      }),
      new CompressionPlugin({
        filename: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.css$|\.html$/,
        threshold: 10240,
        minRatio: 0.8,
      }),
    ].filter(Boolean),
  };
};
