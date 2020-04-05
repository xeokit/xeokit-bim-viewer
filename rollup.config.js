import nodeResolve from 'rollup-plugin-node-resolve';
import minify from 'rollup-plugin-minify-es';

export default {
    input: './index.js',
    output: {
        file: './dist/main.js',
        format: 'es',
        name: 'bundle'
    },
    plugins: [
        nodeResolve(),
        minify()
    ]
}