const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    // Define entry points for both the main and renderer processes.
    entry: {
        main: './src/main.ts',
        renderer: './src/renderer.ts'
    },
    target: 'electron-main', // Electron specific target. For renderer, you can adjust if needed.
    module: {
        rules: [
            {
                test: /\.ts$/,
                include: /src/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js', // Generates main.js and renderer.js
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/index.html', to: '' } // Copy index.html to the dist folder
            ]
        })
    ]
};
