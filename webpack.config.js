const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');


module.exports = {
    entry: './index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    },
    plugins: [
        new CircularDependencyPlugin({
            // exclude detection of files based on a RegExp
            // exclude: /a\.js|node_modules/,
            // include specific files based on a RegExp
            //include: /dir/,
            // add errors to webpack instead of warnings
            failOnError: true,
            // allow import cycles that include an asyncronous import,
            // e.g. via import(/* webpackMode: "weak" */ './file.js')
            allowAsyncCycles: false,
            // set the current working directory for displaying module paths
            cwd: process.cwd(),
        })
    ]
};