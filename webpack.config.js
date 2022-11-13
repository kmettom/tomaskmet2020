const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// const VueLoaderPlugin = require('vue-loader/lib/plugin');
// const ConcatPlugin = require('webpack-concat-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
// const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');


const MiniCssExtractPlugin = require('mini-css-extract-plugin')


module.exports = {
  entry: './src/tk.js',
  output: {
    // filename: 'jk_portfolio.js',
    filename: process.env.NODE_ENV === 'production' ?  "tk_2020.[hash].js" : "tk_2020.js",
    path: path.resolve(__dirname, 'dist'),

  },
  devServer: {
    contentBase: path.join(__dirname, 'src'),
    compress: false,
    port: 4200,
    hot: true,
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              // data: `@import "./src/scss/portfolio.scss";`
            }
          },
        ],
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        include: path.join(__dirname, 'src/img'),
        options: {
          name: '[name].[ext]'
        }
      },
      {
        test: /\.(glsl|vert|frag)$/,
        loader: 'threejs-glsl-loader',
        // Default values (can be omitted)
        options: {
          chunksPath: '../ShaderChunk', // if chunk fails to load with provided path (relative), the loader will retry with this one before giving up
          chunksExt: 'glsl', // Chunks extension, used when #import statement omits extension
        }
      }
     //  {
     //   test: /\.html$/i,
     //   loader: 'html-loader',
     // },

    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: "index.html",
      title: 'Caching',
    }),

    // new WebpackMd5Hash(),

  // new HtmlWebpackPlugin()
]



}


// if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = '#source-map'
//   // http://vue-loader.vuejs.org/en/workflow/production.html
//   module.exports.plugins = (module.exports.plugins || []).concat([
//     new webpack.DefinePlugin({
//       'process.env': {
//         NODE_ENV: '"production"'
//       }
//     }),
//     // new webpack.optimize.UglifyJsPlugin({
//     //   sourceMap: true,
//     //   compress: {
//     //     warnings: false
//     //   }
//     // }),
//     new webpack.LoaderOptionsPlugin({
//       minimize: true
//     })
//   ])
// }
