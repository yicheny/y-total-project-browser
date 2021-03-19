module.exports = {
    module:{
        rules:[
            {
                test: /\.css$/,
                loader: "style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader"
            }
        ]
    }
}
