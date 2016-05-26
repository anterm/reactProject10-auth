var path = require('path')
var webpack = require('webpack')

var localIdentName = "[name]-[local]_[hash:base64:5]"
var cssLoaderString = "css?modules&importLoaders=1&localIdentName=" + localIdentName + "&sourceMap"

module.exports = {
  devtool: 'eval',
  entry: {
    bundle: [
      'webpack-hot-middleware/client',
      './src/client.js'
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": ["es2015", "react", "stage-0"],
          "plugins": [
            ["react-transform", {
              "transforms": [{
                "transform": "react-transform-hmr",
                "imports": ["react"],
                "locals": ["module"]
              }, {
                "transform": "react-transform-catch-errors",
                "imports": ["react", "redbox-react"]
              }]
            }]
          ]
        }
      },
      {
        test: /\.css$/,
        loader: 'style!' + cssLoaderString + "!postcss"
      },
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?[\w\d\#]+)?$/, 
        loader: 'url?limit=100000'
      },
      {
        test: /\.(gif|png|jpg)$/,
        loader: 'url?name=[name].[ext]'
      }
    ]
  },
  
  postcss: function() {
    return [
      require('postcss-modules-values'),
      require('precss'),
      require('postcss-cssnext'),
    ]
  }
}