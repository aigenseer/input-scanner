const path = require("path");
const webpack = require("webpack");
const FILENAME = require("./package.json").name;
const DIST_FOLDER = path.resolve(__dirname, '..', 'plugin', 'assets');
//const DIST_FOLDER = path.resolve(__dirname, 'dist');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/index.tsx",
    output: {
        filename: FILENAME+".js",
        path: DIST_FOLDER
    },

    // Enable sourcemaps for debugging webpack's output.
    // devtool: "source-map",
    // mode: "development",
    mode: "production",

    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".ts", ".tsx", ".js", ".json", "svg"]
    },

    module: {
        rules: [
            //{ loader: 'cache-loader' },
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            {
              test: /\.tsx?$/,
              loader: "ts-loader",
              options: {
                transpileOnly: true
              }
            },
            {
                test: /\.(ttf|eot|woff|woff2)$/,
                loader: 'file-loader',
                options: {
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                 test: /\.css$/,
                 use: [MiniCssExtractPlugin.loader, "css-loader"],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
            //image
            {
              test: /\.(pdf|jpg|png|gif|svg|ico)$/,
              use: [
                  {
                      loader: 'url-loader'
                  },
              ]
            }
        ]
    },

    plugins: [
        new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
        }),
        new MiniCssExtractPlugin({
            filename: FILENAME+".css"
        })
    ],
};
