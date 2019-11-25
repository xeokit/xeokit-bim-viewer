import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    input: './index.js',
    output: {
        file: './dist/main.js',
        format: 'es',
        name: 'bundle'
    },
    plugins: [
        nodeResolve()
    ]
}