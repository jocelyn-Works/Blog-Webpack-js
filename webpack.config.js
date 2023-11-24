const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require("path"); // j'importe une librairie path
const HtmlWebpackPlugin = require("html-webpack-plugin"); // j'importe le htmlwebpack-plugin
const webpack = require('webpack');

module.exports = {
 // Point d'entree
 entry: {
 main: path.join(__dirname, "src/index.js"),
 form: path.join(__dirname, "src/form/form.js"),
 topbar: path.join(__dirname, "src/assets/javascripts/topbar.js")
 },
 // Point de sortie
 output: {
 // permet d'avoir un chemin absolu
 path: path.join(__dirname, "dist"),
 // le [name] correspond au main de "entry"
 filename: "[name].bundle.js"
 },
 module: {
 // on applique ici nos loaders
 rules: [
 {
 //regex pour recuperer tous les fichiers .js
 test: /\.js/,
 // on exclue de la regle tous les fichiers provenant de
// node_modules
 exclude: /(node_modules)/,
 // et on utilise comme loader pour les fichiers js: babel-loader
// => ecrire en version plus anciennes nos scripts js
 use: ["babel-loader"]
 },
 {
 test: /\.scss$/i,
 exclude: /(node_modules)/,
 use: ["style-loader", "css-loader", "sass-loader"]
 }
 ]
 },
 // plugins => fonctionnalites en plus que l'on va ajouter
 plugins: [
 // il va nous permettre de recuperer le index.html et d'injecter
// directement le bundle, sans que l'on est a faire manuellement
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
    patterns: [
        {
            from: 'src/assets',
            to: 'assets'
        }
    ]
}),
 new HtmlWebpackPlugin({
    filename: 'index.html',
    template: path.resolve(__dirname, "src/index.html"),
    chunks : ["main","topbar"]
 }),
 new HtmlWebpackPlugin({
    filename: 'form.html',
    template: path.resolve(__dirname, "src/form/form.html"),
    chunks : ["form","topbar"]
    })
    
 ],
 stats: "minimal",
 devtool: "source-map",
 mode: "development",
 devServer: {
 static: path.resolve(__dirname, './dist'),
 open: true,
 port: 4000
 }
};
