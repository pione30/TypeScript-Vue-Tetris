const path = require("path")
const merge = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "development",
  devServer: {
    index: "index.html",
    contentBase: path.resolve(__dirname, "./dist"),
    historyApiFallback: true
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map"
})
