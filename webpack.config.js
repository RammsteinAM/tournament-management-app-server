// const path = require('path');

// const { NODE_ENV } = process.env;

// module.exports = {
//     entry: './src/index.ts',
//     mode: NODE_ENV,
//     target: 'node',
//     output: {
//         path: path.resolve(__dirname, 'build'),
//         filename: 'bundle.js'
//     },
//     resolve: {
//         extensions: ['.ts', '.js'],
//     },
//     module: {
//         rules: [
//             {
//                 use: 'ts-loader',
//                 test: /\.ts?$/
//             }
//         ]
//     },
// }