const merge = require("webpack-merge")
const common = require("./webpack.common.js")

module.exports = merge(common, {
  mode: "development",
  devServer: {
    index: "index.html",
    publicPath: "/dist/",
    historyApiFallback: true
  },
  performance: {
    hints: false
  },
  devtool: "#eval-source-map"
})
