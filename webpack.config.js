const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: './src/js/app.js',
    output: {
      filename: 'app.js',
      path: path.resolve(__dirname, 'public')
    },
    plugins: [
      // 컴파일 + 번들링 CSS 파일이 저장될 경로와 이름 지정
      new MiniCssExtractPlugin({ filename: 'css/style.css' })
    ],
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
          exclude: /node_modules/
        }
      ]
    },
    devtool: 'source-map',
    mode: 'development'
  };