const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./src/app.ts", // Entry point is set to src/app.ts
  target: "node",
  externals: [
    nodeExternals({
      allowlist: [/^src\/models/, /^src\/migrations/],
    }),
  ],
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
};
