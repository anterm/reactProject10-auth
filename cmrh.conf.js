module.exports = {
  generateScopedName: "[name]-[local]_[hash:base64:5]",
  prepend: [
  	require("postcss-modules-values"),
  	require("postcss-cssnext")()
  ]
}